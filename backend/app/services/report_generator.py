"""
Report Generation Service

This module handles PDF report generation with vegetation analysis results,
maps, charts, and recommendations.
"""

import os
import asyncio
from pathlib import Path
from typing import Dict, List, Optional, Any
from uuid import UUID
from datetime import datetime, date
import tempfile
import base64
from io import BytesIO

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle
from reportlab.platypus import PageBreak, KeepTogether
from reportlab.graphics.shapes import Drawing
from reportlab.graphics.charts.piecharts import Pie
from reportlab.graphics.charts.barcharts import VerticalBarChart
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.colors import LinearSegmentedColormap
import numpy as np
import structlog

from app.config import settings
from app.models.report import Report
from app.models.analysis import AnalysisResult, VegetationIndexResult, AnalysisZone
from app.services.storage_service import StorageService
from app.core.exceptions import ProcessingError

logger = structlog.get_logger()


class ReportGenerator:
    """Handles PDF report generation for vegetation analysis."""
    
    def __init__(self):
        self.storage_service = StorageService()
        self.temp_dir = Path(tempfile.gettempdir()) / "talazo_reports"
        self.temp_dir.mkdir(exist_ok=True)
        
        # Setup report styles
        self.styles = getSampleStyleSheet()
        self.setup_custom_styles()
    
    def setup_custom_styles(self):
        """Setup custom paragraph styles for the report."""
        # Title style
        self.styles.add(ParagraphStyle(
            name='CustomTitle',
            parent=self.styles['Title'],
            fontSize=24,
            textColor=colors.HexColor('#2D5B1B'),  # Talazo green
            spaceAfter=20,
            alignment=TA_CENTER
        ))
        
        # Section header style
        self.styles.add(ParagraphStyle(
            name='SectionHeader',
            parent=self.styles['Heading1'],
            fontSize=16,
            textColor=colors.HexColor('#2D5B1B'),
            spaceBefore=20,
            spaceAfter=10,
            borderWidth=1,
            borderColor=colors.HexColor('#2D5B1B'),
            borderPadding=5
        ))
        
        # Subsection header style
        self.styles.add(ParagraphStyle(
            name='SubsectionHeader',
            parent=self.styles['Heading2'],
            fontSize=14,
            textColor=colors.HexColor('#4A7C2A'),
            spaceBefore=15,
            spaceAfter=8
        ))
        
        # Recommendation style
        self.styles.add(ParagraphStyle(
            name='Recommendation',
            parent=self.styles['Normal'],
            fontSize=11,
            textColor=colors.HexColor('#1A4D0C'),
            leftIndent=20,
            spaceBefore=5,
            spaceAfter=5,
            borderWidth=1,
            borderColor=colors.HexColor('#E8F5E8'),
            borderPadding=8,
            backColor=colors.HexColor('#F5FFF5')
        ))
        
        # Key metric style
        self.styles.add(ParagraphStyle(
            name='KeyMetric',
            parent=self.styles['Normal'],
            fontSize=12,
            textColor=colors.HexColor('#2D5B1B'),
            alignment=TA_CENTER,
            spaceBefore=5,
            spaceAfter=5
        ))
    
    async def generate_report(
        self, 
        report: Report, 
        analysis_result: AnalysisResult,
        farmer_info: Dict[str, Any]
    ) -> str:
        """
        Generate a comprehensive PDF report.
        
        Args:
            report: Report database model
            analysis_result: Analysis results
            farmer_info: Farmer information
            
        Returns:
            URL of the generated PDF report
        """
        try:
            logger.info("Starting PDF report generation", report_id=str(report.id))
            
            # Create temporary PDF file
            pdf_path = self.temp_dir / f"report_{report.id}.pdf"
            
            # Create PDF document
            doc = SimpleDocTemplate(
                str(pdf_path),
                pagesize=A4,
                rightMargin=72,
                leftMargin=72,
                topMargin=72,
                bottomMargin=18
            )
            
            # Build report content
            story = []
            
            # Add header and title
            story.extend(await self._build_header(report, farmer_info))
            
            # Add executive summary
            story.extend(await self._build_executive_summary(analysis_result))
            
            # Add vegetation health analysis
            story.extend(await self._build_vegetation_analysis(analysis_result))
            
            # Add water stress analysis
            story.extend(await self._build_water_analysis(analysis_result))
            
            # Add zone analysis
            if analysis_result.analysis_zones:
                story.extend(await self._build_zone_analysis(analysis_result.analysis_zones))
            
            # Add recommendations
            story.extend(await self._build_recommendations(analysis_result))
            
            # Add maps and visualizations
            story.extend(await self._build_visualizations(analysis_result))
            
            # Add technical details
            story.extend(await self._build_technical_details(report, analysis_result))
            
            # Add footer
            story.extend(await self._build_footer())
            
            # Build PDF
            doc.build(story)
            
            # Upload to storage
            pdf_url = await self.storage_service.upload_file(
                pdf_path,
                f"reports/{report.id}/vegetation_analysis_report.pdf",
                "application/pdf"
            )
            
            # Cleanup temporary file
            if pdf_path.exists():
                pdf_path.unlink()
            
            logger.info("PDF report generated successfully", report_id=str(report.id), url=pdf_url)
            
            return pdf_url
            
        except Exception as e:
            logger.error("PDF report generation failed", error=str(e), report_id=str(report.id))
            raise ProcessingError(f"Failed to generate PDF report: {str(e)}")
    
    async def _build_header(self, report: Report, farmer_info: Dict[str, Any]) -> List:
        """Build report header with title and basic information."""
        content = []
        
        # Main title
        content.append(Paragraph("Vegetation Analysis Report", self.styles['CustomTitle']))
        content.append(Spacer(1, 20))
        
        # Report information table
        report_data = [
            ['Report Name:', report.report_name],
            ['Farmer:', farmer_info.get('full_name', 'Unknown')],
            ['Farm Location:', farmer_info.get('farm_location', 'Unknown')],
            ['Analysis Date:', report.report_date.strftime('%B %d, %Y')],
            ['Field Area:', f"{report.field_area_hectares:.1f} hectares" if report.field_area_hectares else "Unknown"],
            ['Report Generated:', datetime.now().strftime('%B %d, %Y at %I:%M %p')]
        ]
        
        report_table = Table(report_data, colWidths=[2*inch, 3*inch])
        report_table.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('ALIGN', (0, 0), (0, -1), 'RIGHT'),
            ('ALIGN', (1, 0), (1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('GRID', (0, 0), (-1, -1), 1, colors.lightgrey),
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#F5F5F5'))
        ]))
        
        content.append(report_table)
        content.append(Spacer(1, 30))
        
        return content
    
    async def _build_executive_summary(self, analysis_result: AnalysisResult) -> List:
        """Build executive summary section."""
        content = []
        
        content.append(Paragraph("Executive Summary", self.styles['SectionHeader']))
        
        # Overall health score
        health_score = analysis_result.vegetation_health_score or 0
        health_status = self._get_health_status(health_score)
        
        summary_text = f"""
        This vegetation analysis covers {analysis_result.total_area_analyzed_hectares:.1f} hectares 
        of agricultural land using {analysis_result.image_count_processed} drone images. 
        The overall vegetation health score is <b>{health_score:.1f}%</b>, indicating 
        <b>{health_status}</b> crop conditions.
        """
        
        content.append(Paragraph(summary_text, self.styles['Normal']))
        content.append(Spacer(1, 10))
        
        # Key metrics table
        metrics_data = [
            ['Metric', 'Value', 'Status'],
            ['Vegetation Health Score', f"{health_score:.1f}%", health_status],
            ['Area Analyzed', f"{analysis_result.total_area_analyzed_hectares:.1f} ha", "Complete"],
            ['Analysis Confidence', f"{(analysis_result.analysis_confidence or 0) * 100:.1f}%", "High"],
            ['Data Quality', f"{(analysis_result.data_quality_score or 0) * 100:.1f}%", "Good"]
        ]
        
        metrics_table = Table(metrics_data, colWidths=[2*inch, 1.5*inch, 1.5*inch])
        metrics_table.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2D5B1B')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#F9F9F9'))
        ]))
        
        content.append(metrics_table)
        content.append(Spacer(1, 20))
        
        return content
    
    async def _build_vegetation_analysis(self, analysis_result: AnalysisResult) -> List:
        """Build vegetation health analysis section."""
        content = []
        
        content.append(Paragraph("Vegetation Health Analysis", self.styles['SectionHeader']))
        
        if analysis_result.overall_ndvi:
            ndvi = analysis_result.overall_ndvi
            
            content.append(Paragraph("NDVI (Normalized Difference Vegetation Index)", self.styles['SubsectionHeader']))
            
            ndvi_text = f"""
            The NDVI analysis shows an average value of <b>{ndvi.mean_value:.3f}</b>, 
            with values ranging from {ndvi.min_value:.3f} to {ndvi.max_value:.3f}. 
            This indicates:
            """
            content.append(Paragraph(ndvi_text, self.styles['Normal']))
            
            # NDVI breakdown
            ndvi_data = [
                ['Vegetation Category', 'Area (%)', 'Health Status'],
                ['Healthy Vegetation', f"{ndvi.healthy_percent:.1f}%", "Excellent"],
                ['Stressed Vegetation', f"{ndvi.stressed_percent:.1f}%", "Moderate"],
                ['Severely Stressed', f"{ndvi.severely_stressed_percent:.1f}%", "Poor"]
            ]
            
            ndvi_table = Table(ndvi_data, colWidths=[2*inch, 1.5*inch, 1.5*inch])
            ndvi_table.setStyle(TableStyle([
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 10),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('GRID', (0, 0), (-1, -1), 1, colors.black),
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#4A7C2A')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('BACKGROUND', (0, 1), (0, 1), colors.HexColor('#E8F5E8')),
                ('BACKGROUND', (0, 2), (0, 2), colors.HexColor('#FFF5CC')),
                ('BACKGROUND', (0, 3), (0, 3), colors.HexColor('#FFE5E5'))
            ]))
            
            content.append(ndvi_table)
            content.append(Spacer(1, 15))
        
        return content
    
    async def _build_water_analysis(self, analysis_result: AnalysisResult) -> List:
        """Build water stress analysis section."""
        content = []
        
        content.append(Paragraph("Water Stress Analysis", self.styles['SectionHeader']))
        
        if analysis_result.overall_ndwi:
            ndwi = analysis_result.overall_ndwi
            
            water_stress_level = analysis_result.water_stress_level or "unknown"
            
            content.append(Paragraph("NDWI (Normalized Difference Water Index)", self.styles['SubsectionHeader']))
            
            ndwi_text = f"""
            The water stress analysis indicates <b>{water_stress_level}</b> water stress levels 
            across the field. The average NDWI value is <b>{ndwi.mean_value:.3f}</b>.
            """
            content.append(Paragraph(ndwi_text, self.styles['Normal']))
            
            # Water stress recommendations
            if water_stress_level == "high":
                recommendation = "Immediate irrigation recommended to prevent crop damage."
            elif water_stress_level == "medium":
                recommendation = "Monitor closely and consider supplemental irrigation."
            else:
                recommendation = "Current water levels appear adequate."
            
            content.append(Paragraph(f"<b>Recommendation:</b> {recommendation}", self.styles['Recommendation']))
            content.append(Spacer(1, 15))
        
        return content
    
    async def _build_zone_analysis(self, zones: List[AnalysisZone]) -> List:
        """Build zone-specific analysis section."""
        content = []
        
        content.append(Paragraph("Zone-Specific Analysis", self.styles['SectionHeader']))
        
        for zone in zones[:5]:  # Limit to first 5 zones for brevity
            content.append(Paragraph(f"Zone {zone.zone_id.split('_')[-1]}", self.styles['SubsectionHeader']))
            
            zone_text = f"""
            <b>Area:</b> {zone.area_hectares:.2f} hectares<br/>
            """
            
            if zone.ndvi_result:
                zone_text += f"<b>NDVI Score:</b> {zone.ndvi_result.mean_value:.3f}<br/>"
                zone_text += f"<b>Healthy Vegetation:</b> {zone.ndvi_result.healthy_percent:.1f}%<br/>"
            
            content.append(Paragraph(zone_text, self.styles['Normal']))
            
            # Zone recommendations
            if zone.irrigation_recommendation:
                content.append(Paragraph(f"<b>Irrigation:</b> {zone.irrigation_recommendation}", self.styles['Recommendation']))
            
            if zone.fertilizer_recommendation:
                content.append(Paragraph(f"<b>Fertilizer:</b> {zone.fertilizer_recommendation}", self.styles['Recommendation']))
            
            content.append(Spacer(1, 10))
        
        return content
    
    async def _build_recommendations(self, analysis_result: AnalysisResult) -> List:
        """Build recommendations section."""
        content = []
        
        content.append(Paragraph("Actionable Recommendations", self.styles['SectionHeader']))
        
        # Priority actions
        priority_text = """
        Based on the vegetation analysis, here are the recommended actions 
        in order of priority:
        """
        content.append(Paragraph(priority_text, self.styles['Normal']))
        content.append(Spacer(1, 10))
        
        # Recommendations list
        for i, recommendation in enumerate(analysis_result.recommended_actions[:8], 1):
            rec_text = f"<b>{i}.</b> {recommendation}"
            content.append(Paragraph(rec_text, self.styles['Recommendation']))
        
        content.append(Spacer(1, 20))
        
        return content
    
    async def _build_visualizations(self, analysis_result: AnalysisResult) -> List:
        """Build visualizations section."""
        content = []
        
        content.append(Paragraph("Maps and Visualizations", self.styles['SectionHeader']))
        
        viz_text = """
        The following visualizations provide a spatial view of vegetation health 
        and water stress across your field. Green areas indicate healthy vegetation, 
        while red areas require attention.
        """
        content.append(Paragraph(viz_text, self.styles['Normal']))
        content.append(Spacer(1, 10))
        
        # Add placeholders for maps (in production, these would be actual images)
        if analysis_result.ndvi_heatmap_url:
            content.append(Paragraph("NDVI Heatmap", self.styles['SubsectionHeader']))
            content.append(Paragraph("NDVI heatmap would be displayed here.", self.styles['Normal']))
            content.append(Spacer(1, 10))
        
        if analysis_result.ndwi_heatmap_url:
            content.append(Paragraph("Water Stress Map", self.styles['SubsectionHeader']))
            content.append(Paragraph("Water stress map would be displayed here.", self.styles['Normal']))
            content.append(Spacer(1, 10))
        
        return content
    
    async def _build_technical_details(self, report: Report, analysis_result: AnalysisResult) -> List:
        """Build technical details section."""
        content = []
        
        content.append(PageBreak())
        content.append(Paragraph("Technical Details", self.styles['SectionHeader']))
        
        # Processing information
        tech_data = [
            ['Parameter', 'Value'],
            ['Images Processed', str(analysis_result.image_count_processed)],
            ['Processing Time', f"{analysis_result.processing_duration_seconds or 0} seconds"],
            ['Analysis Confidence', f"{(analysis_result.analysis_confidence or 0) * 100:.1f}%"],
            ['Data Quality Score', f"{(analysis_result.data_quality_score or 0) * 100:.1f}%"],
            ['Weather Conditions', analysis_result.weather_conditions.get('summary', 'Not available') if analysis_result.weather_conditions else 'Not available']
        ]
        
        tech_table = Table(tech_data, colWidths=[2.5*inch, 2.5*inch])
        tech_table.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('GRID', (0, 0), (-1, -1), 1, colors.grey),
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#E0E0E0'))
        ]))
        
        content.append(tech_table)
        content.append(Spacer(1, 20))
        
        # Methodology
        content.append(Paragraph("Methodology", self.styles['SubsectionHeader']))
        methodology_text = """
        This analysis was conducted using drone-captured multispectral imagery 
        processed with advanced vegetation indices including NDVI and NDWI. 
        The analysis provides insights into vegetation health, water stress, 
        and actionable recommendations for precision agriculture.
        """
        content.append(Paragraph(methodology_text, self.styles['Normal']))
        
        return content
    
    async def _build_footer(self) -> List:
        """Build report footer."""
        content = []
        
        content.append(Spacer(1, 30))
        
        footer_text = """
        <para alignment="center">
        <b>Generated by Talazo Intelligence Platform</b><br/>
        For support or questions, contact: support@talazo.com<br/>
        Report generated on {timestamp}
        </para>
        """.format(timestamp=datetime.now().strftime('%B %d, %Y at %I:%M %p'))
        
        content.append(Paragraph(footer_text, self.styles['Normal']))
        
        return content
    
    def _get_health_status(self, score: float) -> str:
        """Get health status description from score."""
        if score >= 80:
            return "Excellent"
        elif score >= 65:
            return "Good"
        elif score >= 50:
            return "Fair"
        elif score >= 35:
            return "Poor"
        else:
            return "Critical"