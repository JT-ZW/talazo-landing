"""
Email Service Module

This module handles email notifications for the Talazo intelligence platform,
including report delivery, alerts, and communication with farmers.
"""

import os
import asyncio
from typing import Dict, List, Optional, Any
from datetime import datetime
from email.mime.text import MimeText
from email.mime.multipart import MimeMultipart
from email.mime.base import MimeBase
from email import encoders
import smtplib
import structlog

import resend
from jinja2 import Environment, FileSystemLoader

from app.config import settings
from app.core.exceptions import EmailDeliveryError

logger = structlog.get_logger()


class EmailService:
    """Handles email sending and template management."""
    
    def __init__(self):
        self.resend_api_key = settings.RESEND_API_KEY
        self.from_email = settings.FROM_EMAIL
        self.admin_email = settings.ADMIN_EMAIL
        
        # Initialize Resend if API key is available
        if self.resend_api_key:
            resend.api_key = self.resend_api_key
        
        # Setup Jinja2 for email templates
        template_path = os.path.join(os.path.dirname(__file__), '..', 'templates', 'email')
        self.jinja_env = Environment(
            loader=FileSystemLoader(template_path),
            autoescape=True
        )
    
    async def send_report_notification(
        self,
        farmer_email: str,
        farmer_name: str,
        report_name: str,
        report_url: str,
        summary_data: Dict[str, Any]
    ) -> bool:
        """
        Send report notification to farmer.
        
        Args:
            farmer_email: Farmer's email address
            farmer_name: Farmer's name
            report_name: Name of the report
            report_url: URL to download the report
            summary_data: Summary of analysis results
            
        Returns:
            True if email sent successfully
        """
        try:
            logger.info("Sending report notification", farmer_email=farmer_email, report_name=report_name)
            
            # Prepare email content
            subject = f"Your Vegetation Analysis Report: {report_name}"
            
            # Render HTML template
            html_content = await self._render_report_template(
                farmer_name=farmer_name,
                report_name=report_name,
                report_url=report_url,
                summary_data=summary_data
            )
            
            # Render text template (fallback)
            text_content = await self._render_report_text_template(
                farmer_name=farmer_name,
                report_name=report_name,
                report_url=report_url,
                summary_data=summary_data
            )
            
            # Send email
            success = await self._send_email(
                to_email=farmer_email,
                subject=subject,
                html_content=html_content,
                text_content=text_content
            )
            
            if success:
                logger.info("Report notification sent successfully", farmer_email=farmer_email)
            else:
                logger.error("Failed to send report notification", farmer_email=farmer_email)
            
            return success
            
        except Exception as e:
            logger.error("Error sending report notification", error=str(e), farmer_email=farmer_email)
            return False
    
    async def send_analysis_alert(
        self,
        farmer_email: str,
        farmer_name: str,
        alert_type: str,
        alert_message: str,
        priority: str = "medium"
    ) -> bool:
        """
        Send analysis alert to farmer.
        
        Args:
            farmer_email: Farmer's email address
            farmer_name: Farmer's name
            alert_type: Type of alert (water_stress, disease_detection, etc.)
            alert_message: Alert message
            priority: Alert priority (low, medium, high, critical)
            
        Returns:
            True if email sent successfully
        """
        try:
            logger.info("Sending analysis alert", farmer_email=farmer_email, alert_type=alert_type)
            
            subject = f"🚨 Field Alert: {alert_type.replace('_', ' ').title()}"
            
            # Render alert template
            html_content = await self._render_alert_template(
                farmer_name=farmer_name,
                alert_type=alert_type,
                alert_message=alert_message,
                priority=priority
            )
            
            text_content = await self._render_alert_text_template(
                farmer_name=farmer_name,
                alert_type=alert_type,
                alert_message=alert_message,
                priority=priority
            )
            
            # Send email
            success = await self._send_email(
                to_email=farmer_email,
                subject=subject,
                html_content=html_content,
                text_content=text_content
            )
            
            if success:
                logger.info("Analysis alert sent successfully", farmer_email=farmer_email)
            else:
                logger.error("Failed to send analysis alert", farmer_email=farmer_email)
            
            return success
            
        except Exception as e:
            logger.error("Error sending analysis alert", error=str(e), farmer_email=farmer_email)
            return False
    
    async def send_admin_notification(
        self,
        subject: str,
        message: str,
        data: Optional[Dict[str, Any]] = None
    ) -> bool:
        """
        Send notification to admin.
        
        Args:
            subject: Email subject
            message: Email message
            data: Additional data to include
            
        Returns:
            True if email sent successfully
        """
        try:
            logger.info("Sending admin notification", subject=subject)
            
            # Render admin template
            html_content = await self._render_admin_template(
                subject=subject,
                message=message,
                data=data or {}
            )
            
            text_content = f"Admin Notification\\n\\n{message}\\n\\nData: {str(data) if data else 'None'}"
            
            # Send email
            success = await self._send_email(
                to_email=self.admin_email,
                subject=f"[Talazo Admin] {subject}",
                html_content=html_content,
                text_content=text_content
            )
            
            if success:
                logger.info("Admin notification sent successfully")
            else:
                logger.error("Failed to send admin notification")
            
            return success
            
        except Exception as e:
            logger.error("Error sending admin notification", error=str(e))
            return False
    
    async def send_bulk_notifications(
        self,
        emails: List[Dict[str, Any]]
    ) -> Dict[str, bool]:
        """
        Send bulk email notifications.
        
        Args:
            emails: List of email data dictionaries
                   Each should contain: to_email, subject, html_content, text_content
            
        Returns:
            Dictionary mapping email addresses to success status
        """
        results = {}
        
        for email_data in emails:
            try:
                success = await self._send_email(
                    to_email=email_data["to_email"],
                    subject=email_data["subject"],
                    html_content=email_data.get("html_content"),
                    text_content=email_data.get("text_content")
                )
                results[email_data["to_email"]] = success
                
                # Add small delay to avoid rate limiting
                await asyncio.sleep(0.1)
                
            except Exception as e:
                logger.error("Bulk email failed", email=email_data["to_email"], error=str(e))
                results[email_data["to_email"]] = False
        
        return results
    
    async def _send_email(
        self,
        to_email: str,
        subject: str,
        html_content: Optional[str] = None,
        text_content: Optional[str] = None,
        attachments: Optional[List[Dict[str, Any]]] = None
    ) -> bool:
        """
        Send email using Resend or fallback SMTP.
        
        Args:
            to_email: Recipient email address
            subject: Email subject
            html_content: HTML email content
            text_content: Plain text email content
            attachments: List of attachment data
            
        Returns:
            True if email sent successfully
        """
        try:
            # Try Resend first
            if self.resend_api_key:
                return await self._send_via_resend(
                    to_email=to_email,
                    subject=subject,
                    html_content=html_content,
                    text_content=text_content,
                    attachments=attachments
                )
            
            # Fallback to SMTP if available
            elif settings.SMTP_HOST:
                return await self._send_via_smtp(
                    to_email=to_email,
                    subject=subject,
                    html_content=html_content,
                    text_content=text_content,
                    attachments=attachments
                )
            
            else:
                logger.warning("No email service configured")
                return False
                
        except Exception as e:
            logger.error("Email sending failed", error=str(e), to_email=to_email)
            return False
    
    async def _send_via_resend(
        self,
        to_email: str,
        subject: str,
        html_content: Optional[str] = None,
        text_content: Optional[str] = None,
        attachments: Optional[List[Dict[str, Any]]] = None
    ) -> bool:
        """Send email using Resend service."""
        try:
            email_data = {
                "from": self.from_email,
                "to": [to_email],
                "subject": subject
            }
            
            if html_content:
                email_data["html"] = html_content
            
            if text_content:
                email_data["text"] = text_content
            
            if attachments:
                email_data["attachments"] = attachments
            
            # Send email
            response = resend.Emails.send(email_data)
            
            if response:
                logger.debug("Email sent via Resend", to_email=to_email, response_id=response.get("id"))
                return True
            else:
                logger.error("Resend API returned no response", to_email=to_email)
                return False
                
        except Exception as e:
            logger.error("Resend email failed", error=str(e), to_email=to_email)
            return False
    
    async def _send_via_smtp(
        self,
        to_email: str,
        subject: str,
        html_content: Optional[str] = None,
        text_content: Optional[str] = None,
        attachments: Optional[List[Dict[str, Any]]] = None
    ) -> bool:
        """Send email using SMTP."""
        try:
            # Create message
            msg = MimeMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = self.from_email
            msg["To"] = to_email
            
            # Add text content
            if text_content:
                msg.attach(MimeText(text_content, "plain"))
            
            # Add HTML content
            if html_content:
                msg.attach(MimeText(html_content, "html"))
            
            # Add attachments
            if attachments:
                for attachment in attachments:
                    part = MimeBase("application", "octet-stream")
                    part.set_payload(attachment["content"])
                    encoders.encode_base64(part)
                    part.add_header(
                        "Content-Disposition",
                        f"attachment; filename= {attachment['filename']}"
                    )
                    msg.attach(part)
            
            # Send email
            with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
                if settings.SMTP_USE_TLS:
                    server.starttls()
                
                if settings.SMTP_USERNAME and settings.SMTP_PASSWORD:
                    server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
                
                server.send_message(msg)
            
            logger.debug("Email sent via SMTP", to_email=to_email)
            return True
            
        except Exception as e:
            logger.error("SMTP email failed", error=str(e), to_email=to_email)
            return False
    
    async def _render_report_template(
        self,
        farmer_name: str,
        report_name: str,
        report_url: str,
        summary_data: Dict[str, Any]
    ) -> str:
        """Render report notification HTML template."""
        try:
            template = self.jinja_env.get_template("report_notification.html")
            return template.render(
                farmer_name=farmer_name,
                report_name=report_name,
                report_url=report_url,
                summary_data=summary_data,
                timestamp=datetime.now().strftime("%B %d, %Y at %I:%M %p")
            )
        except Exception:
            # Fallback to simple HTML
            return f"""
            <html>
            <body>
                <h2>Your Vegetation Analysis Report is Ready</h2>
                <p>Dear {farmer_name},</p>
                <p>Your vegetation analysis report "{report_name}" has been completed and is ready for download.</p>
                <p><a href="{report_url}" style="background-color: #2D5B1B; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Download Report</a></p>
                <p>Best regards,<br>The Talazo Team</p>
            </body>
            </html>
            """
    
    async def _render_report_text_template(
        self,
        farmer_name: str,
        report_name: str,
        report_url: str,
        summary_data: Dict[str, Any]
    ) -> str:
        """Render report notification text template."""
        return f"""
Dear {farmer_name},

Your vegetation analysis report "{report_name}" has been completed and is ready for download.

Download your report: {report_url}

Summary:
- Vegetation Health Score: {summary_data.get('health_score', 'N/A')}%
- Area Analyzed: {summary_data.get('area_analyzed', 'N/A')} hectares
- Analysis Date: {summary_data.get('analysis_date', 'N/A')}

Best regards,
The Talazo Team
        """
    
    async def _render_alert_template(
        self,
        farmer_name: str,
        alert_type: str,
        alert_message: str,
        priority: str
    ) -> str:
        """Render alert notification HTML template."""
        priority_colors = {
            "low": "#28a745",
            "medium": "#ffc107", 
            "high": "#fd7e14",
            "critical": "#dc3545"
        }
        
        color = priority_colors.get(priority, "#6c757d")
        
        return f"""
        <html>
        <body>
            <div style="border-left: 4px solid {color}; padding-left: 20px;">
                <h2 style="color: {color};">Field Alert: {alert_type.replace('_', ' ').title()}</h2>
                <p>Dear {farmer_name},</p>
                <p><strong>Priority:</strong> {priority.upper()}</p>
                <p><strong>Alert:</strong> {alert_message}</p>
                <p>Please review this alert and take appropriate action if necessary.</p>
                <p>Best regards,<br>The Talazo Team</p>
            </div>
        </body>
        </html>
        """
    
    async def _render_alert_text_template(
        self,
        farmer_name: str,
        alert_type: str,
        alert_message: str,
        priority: str
    ) -> str:
        """Render alert notification text template."""
        return f"""
FIELD ALERT - {priority.upper()} PRIORITY

Dear {farmer_name},

Alert Type: {alert_type.replace('_', ' ').title()}
Priority: {priority.upper()}

{alert_message}

Please review this alert and take appropriate action if necessary.

Best regards,
The Talazo Team
        """
    
    async def _render_admin_template(
        self,
        subject: str,
        message: str,
        data: Dict[str, Any]
    ) -> str:
        """Render admin notification HTML template."""
        return f"""
        <html>
        <body>
            <h2>Admin Notification: {subject}</h2>
            <p><strong>Timestamp:</strong> {datetime.now().isoformat()}</p>
            <p><strong>Message:</strong> {message}</p>
            {f'<p><strong>Data:</strong></p><pre>{str(data)}</pre>' if data else ''}
        </body>
        </html>
        """


# Global email service instance
email_service = EmailService()