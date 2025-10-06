"""
Weather Service Module

This module handles weather data integration for the Talazo intelligence platform,
providing weather context for vegetation analysis and field recommendations.
"""

import asyncio
from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime, timedelta
import aiohttp
import structlog

from app.config import settings
from app.core.exceptions import ExternalServiceError

logger = structlog.get_logger()


class WeatherService:
    """Handles weather data retrieval and analysis."""
    
    def __init__(self):
        self.openweather_api_key = settings.OPENWEATHER_API_KEY
        self.base_url = "https://api.openweathermap.org/data/2.5"
        self.onecall_url = "https://api.openweathermap.org/data/3.0/onecall"
        
        # Weather condition mapping for agriculture
        self.agriculture_conditions = {
            "clear": {"irrigation_factor": 1.2, "stress_factor": 1.1},
            "clouds": {"irrigation_factor": 0.9, "stress_factor": 0.8},
            "rain": {"irrigation_factor": 0.3, "stress_factor": 0.5},
            "drizzle": {"irrigation_factor": 0.5, "stress_factor": 0.6},
            "thunderstorm": {"irrigation_factor": 0.2, "stress_factor": 0.7},
            "snow": {"irrigation_factor": 0.1, "stress_factor": 0.4},
            "mist": {"irrigation_factor": 0.8, "stress_factor": 0.7},
            "fog": {"irrigation_factor": 0.7, "stress_factor": 0.6}
        }
    
    async def get_current_weather(
        self,
        latitude: float,
        longitude: float
    ) -> Optional[Dict[str, Any]]:
        """
        Get current weather conditions for a location.
        
        Args:
            latitude: Location latitude
            longitude: Location longitude
            
        Returns:
            Current weather data or None if failed
        """
        if not self.openweather_api_key:
            logger.warning("OpenWeather API key not configured")
            return None
        
        try:
            url = f"{self.base_url}/weather"
            params = {
                "lat": latitude,
                "lon": longitude,
                "appid": self.openweather_api_key,
                "units": "metric"
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, params=params) as response:
                    if response.status == 200:
                        data = await response.json()
                        return await self._process_current_weather(data)
                    else:
                        logger.error("Weather API error", status=response.status)
                        return None
                        
        except Exception as e:
            logger.error("Failed to fetch current weather", error=str(e))
            return None
    
    async def get_weather_forecast(
        self,
        latitude: float,
        longitude: float,
        days: int = 7
    ) -> Optional[Dict[str, Any]]:
        """
        Get weather forecast for a location.
        
        Args:
            latitude: Location latitude
            longitude: Location longitude
            days: Number of days to forecast (max 7)
            
        Returns:
            Weather forecast data or None if failed
        """
        if not self.openweather_api_key:
            logger.warning("OpenWeather API key not configured")
            return None
        
        try:
            url = f"{self.onecall_url}"
            params = {
                "lat": latitude,
                "lon": longitude,
                "appid": self.openweather_api_key,
                "units": "metric",
                "exclude": "minutely,alerts"
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, params=params) as response:
                    if response.status == 200:
                        data = await response.json()
                        return await self._process_forecast_weather(data, days)
                    else:
                        logger.error("Weather forecast API error", status=response.status)
                        return None
                        
        except Exception as e:
            logger.error("Failed to fetch weather forecast", error=str(e))
            return None
    
    async def get_historical_weather(
        self,
        latitude: float,
        longitude: float,
        date: datetime
    ) -> Optional[Dict[str, Any]]:
        """
        Get historical weather data for a specific date.
        
        Args:
            latitude: Location latitude
            longitude: Location longitude
            date: Date for historical data
            
        Returns:
            Historical weather data or None if failed
        """
        if not self.openweather_api_key:
            logger.warning("OpenWeather API key not configured")
            return None
        
        try:
            timestamp = int(date.timestamp())
            url = f"{self.onecall_url}/timemachine"
            params = {
                "lat": latitude,
                "lon": longitude,
                "dt": timestamp,
                "appid": self.openweather_api_key,
                "units": "metric"
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, params=params) as response:
                    if response.status == 200:
                        data = await response.json()
                        return await self._process_historical_weather(data)
                    else:
                        logger.error("Historical weather API error", status=response.status)
                        return None
                        
        except Exception as e:
            logger.error("Failed to fetch historical weather", error=str(e))
            return None
    
    async def analyze_weather_impact(
        self,
        latitude: float,
        longitude: float,
        analysis_date: datetime,
        days_history: int = 7
    ) -> Dict[str, Any]:
        """
        Analyze weather impact on vegetation for analysis context.
        
        Args:
            latitude: Location latitude
            longitude: Location longitude
            analysis_date: Date of vegetation analysis
            days_history: Days of historical weather to consider
            
        Returns:
            Weather impact analysis
        """
        try:
            logger.info("Analyzing weather impact", lat=latitude, lon=longitude)
            
            # Get current weather
            current_weather = await self.get_current_weather(latitude, longitude)
            
            # Get recent historical weather
            historical_data = []
            for i in range(days_history):
                historical_date = analysis_date - timedelta(days=i+1)
                weather_data = await self.get_historical_weather(latitude, longitude, historical_date)
                if weather_data:
                    historical_data.append(weather_data)
                
                # Add delay to avoid rate limiting
                await asyncio.sleep(0.1)
            
            # Get forecast
            forecast = await self.get_weather_forecast(latitude, longitude)
            
            # Analyze impact
            impact_analysis = await self._calculate_weather_impact(
                current_weather, historical_data, forecast
            )
            
            return {
                "current_weather": current_weather,
                "historical_summary": await self._summarize_historical_weather(historical_data),
                "forecast_summary": await self._summarize_forecast(forecast),
                "impact_analysis": impact_analysis,
                "recommendations": await self._generate_weather_recommendations(impact_analysis)
            }
            
        except Exception as e:
            logger.error("Weather impact analysis failed", error=str(e))
            return {
                "current_weather": None,
                "historical_summary": None,
                "forecast_summary": None,
                "impact_analysis": None,
                "recommendations": []
            }
    
    async def _process_current_weather(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Process current weather API response."""
        try:
            main_condition = data["weather"][0]["main"].lower()
            
            return {
                "temperature": data["main"]["temp"],
                "humidity": data["main"]["humidity"],
                "pressure": data["main"]["pressure"],
                "wind_speed": data["wind"]["speed"],
                "wind_direction": data["wind"].get("deg", 0),
                "condition": main_condition,
                "description": data["weather"][0]["description"],
                "visibility": data.get("visibility", 10000) / 1000,  # Convert to km
                "uv_index": None,  # Not available in current weather API
                "timestamp": datetime.fromtimestamp(data["dt"]),
                "agriculture_factors": self.agriculture_conditions.get(
                    main_condition, 
                    {"irrigation_factor": 1.0, "stress_factor": 1.0}
                )
            }
            
        except Exception as e:
            logger.error("Error processing current weather data", error=str(e))
            return {}
    
    async def _process_forecast_weather(
        self, 
        data: Dict[str, Any], 
        days: int
    ) -> Dict[str, Any]:
        """Process weather forecast API response."""
        try:
            daily_forecasts = []
            
            for day_data in data.get("daily", [])[:days]:
                main_condition = day_data["weather"][0]["main"].lower()
                
                daily_forecasts.append({
                    "date": datetime.fromtimestamp(day_data["dt"]).date(),
                    "temperature_min": day_data["temp"]["min"],
                    "temperature_max": day_data["temp"]["max"],
                    "humidity": day_data["humidity"],
                    "wind_speed": day_data["wind_speed"],
                    "condition": main_condition,
                    "description": day_data["weather"][0]["description"],
                    "precipitation": day_data.get("rain", {}).get("1h", 0) + day_data.get("snow", {}).get("1h", 0),
                    "uv_index": day_data.get("uvi", 0),
                    "agriculture_factors": self.agriculture_conditions.get(
                        main_condition,
                        {"irrigation_factor": 1.0, "stress_factor": 1.0}
                    )
                })
            
            return {
                "daily_forecasts": daily_forecasts,
                "forecast_period_days": len(daily_forecasts)
            }
            
        except Exception as e:
            logger.error("Error processing forecast weather data", error=str(e))
            return {"daily_forecasts": [], "forecast_period_days": 0}
    
    async def _process_historical_weather(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Process historical weather API response."""
        try:
            current_data = data.get("current", {})
            main_condition = current_data.get("weather", [{}])[0].get("main", "").lower()
            
            return {
                "date": datetime.fromtimestamp(current_data["dt"]).date(),
                "temperature": current_data["temp"],
                "humidity": current_data["humidity"],
                "pressure": current_data["pressure"],
                "wind_speed": current_data["wind_speed"],
                "condition": main_condition,
                "description": current_data.get("weather", [{}])[0].get("description", ""),
                "uv_index": current_data.get("uvi", 0),
                "agriculture_factors": self.agriculture_conditions.get(
                    main_condition,
                    {"irrigation_factor": 1.0, "stress_factor": 1.0}
                )
            }
            
        except Exception as e:
            logger.error("Error processing historical weather data", error=str(e))
            return {}
    
    async def _calculate_weather_impact(
        self,
        current: Optional[Dict[str, Any]],
        historical: List[Dict[str, Any]],
        forecast: Optional[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Calculate weather impact on vegetation."""
        try:
            impact = {
                "water_stress_factor": 1.0,
                "heat_stress_factor": 1.0,
                "growth_condition_score": 50,  # Scale 0-100
                "irrigation_urgency": "medium",
                "analysis_reliability": "high"
            }
            
            # Calculate water stress from recent weather
            total_precipitation = 0
            avg_humidity = 0
            high_temp_days = 0
            
            if historical:
                for day in historical:
                    total_precipitation += day.get("precipitation", 0)
                    avg_humidity += day.get("humidity", 50)
                    if day.get("temperature", 20) > 30:  # High temperature threshold
                        high_temp_days += 1
                
                avg_humidity = avg_humidity / len(historical)
                
                # Water stress calculation
                if total_precipitation < 5:  # Less than 5mm in recent days
                    impact["water_stress_factor"] = 1.5
                    impact["irrigation_urgency"] = "high"
                elif total_precipitation < 15:
                    impact["water_stress_factor"] = 1.2
                    impact["irrigation_urgency"] = "medium"
                else:
                    impact["water_stress_factor"] = 0.8
                    impact["irrigation_urgency"] = "low"
                
                # Heat stress calculation
                if high_temp_days > 3:
                    impact["heat_stress_factor"] = 1.4
                elif high_temp_days > 1:
                    impact["heat_stress_factor"] = 1.2
                
                # Growth condition score
                optimal_temp_range = (18, 28)
                optimal_humidity_range = (40, 70)
                
                if current:
                    temp = current.get("temperature", 20)
                    humidity = current.get("humidity", 50)
                    
                    temp_score = 100 if optimal_temp_range[0] <= temp <= optimal_temp_range[1] else max(0, 100 - abs(temp - 23) * 5)
                    humidity_score = 100 if optimal_humidity_range[0] <= humidity <= optimal_humidity_range[1] else max(0, 100 - abs(humidity - 55) * 2)
                    
                    impact["growth_condition_score"] = (temp_score + humidity_score) / 2
            
            # Adjust reliability based on data availability
            if not current or not historical:
                impact["analysis_reliability"] = "low"
            elif len(historical) < 3:
                impact["analysis_reliability"] = "medium"
            
            return impact
            
        except Exception as e:
            logger.error("Error calculating weather impact", error=str(e))
            return {
                "water_stress_factor": 1.0,
                "heat_stress_factor": 1.0,
                "growth_condition_score": 50,
                "irrigation_urgency": "medium",
                "analysis_reliability": "low"
            }
    
    async def _summarize_historical_weather(
        self, 
        historical_data: List[Dict[str, Any]]
    ) -> Optional[Dict[str, Any]]:
        """Summarize historical weather data."""
        if not historical_data:
            return None
        
        try:
            total_precipitation = sum(day.get("precipitation", 0) for day in historical_data)
            avg_temperature = sum(day.get("temperature", 20) for day in historical_data) / len(historical_data)
            avg_humidity = sum(day.get("humidity", 50) for day in historical_data) / len(historical_data)
            
            conditions = [day.get("condition", "unknown") for day in historical_data]
            most_common_condition = max(set(conditions), key=conditions.count)
            
            return {
                "period_days": len(historical_data),
                "total_precipitation_mm": total_precipitation,
                "average_temperature_c": round(avg_temperature, 1),
                "average_humidity_percent": round(avg_humidity, 1),
                "dominant_condition": most_common_condition,
                "precipitation_adequate": total_precipitation >= 10  # Threshold for adequate rainfall
            }
            
        except Exception as e:
            logger.error("Error summarizing historical weather", error=str(e))
            return None
    
    async def _summarize_forecast(
        self, 
        forecast: Optional[Dict[str, Any]]
    ) -> Optional[Dict[str, Any]]:
        """Summarize weather forecast."""
        if not forecast or not forecast.get("daily_forecasts"):
            return None
        
        try:
            daily_forecasts = forecast["daily_forecasts"]
            
            total_precipitation = sum(day.get("precipitation", 0) for day in daily_forecasts)
            avg_temp_max = sum(day.get("temperature_max", 25) for day in daily_forecasts) / len(daily_forecasts)
            avg_temp_min = sum(day.get("temperature_min", 15) for day in daily_forecasts) / len(daily_forecasts)
            
            conditions = [day.get("condition", "unknown") for day in daily_forecasts]
            most_common_condition = max(set(conditions), key=conditions.count)
            
            return {
                "forecast_days": len(daily_forecasts),
                "expected_precipitation_mm": total_precipitation,
                "average_max_temperature_c": round(avg_temp_max, 1),
                "average_min_temperature_c": round(avg_temp_min, 1),
                "dominant_condition": most_common_condition,
                "irrigation_likely_needed": total_precipitation < 5
            }
            
        except Exception as e:
            logger.error("Error summarizing forecast", error=str(e))
            return None
    
    async def _generate_weather_recommendations(
        self, 
        impact_analysis: Dict[str, Any]
    ) -> List[str]:
        """Generate weather-based recommendations."""
        recommendations = []
        
        try:
            water_stress = impact_analysis.get("water_stress_factor", 1.0)
            heat_stress = impact_analysis.get("heat_stress_factor", 1.0)
            growth_score = impact_analysis.get("growth_condition_score", 50)
            irrigation_urgency = impact_analysis.get("irrigation_urgency", "medium")
            
            # Water stress recommendations
            if water_stress > 1.3:
                recommendations.append("Immediate irrigation recommended due to high water stress conditions")
            elif water_stress > 1.1:
                recommendations.append("Consider supplemental irrigation to prevent water stress")
            
            # Heat stress recommendations
            if heat_stress > 1.3:
                recommendations.append("Implement heat stress mitigation measures (shade, cooling)")
            elif heat_stress > 1.1:
                recommendations.append("Monitor for heat stress symptoms in crops")
            
            # Growth conditions
            if growth_score < 30:
                recommendations.append("Current weather conditions are suboptimal for plant growth")
            elif growth_score > 80:
                recommendations.append("Excellent weather conditions for plant growth and development")
            
            # Irrigation timing
            if irrigation_urgency == "high":
                recommendations.append("Prioritize irrigation within the next 24-48 hours")
            elif irrigation_urgency == "low":
                recommendations.append("Irrigation can be delayed - current moisture levels are adequate")
            
            # General recommendations
            if not recommendations:
                recommendations.append("Weather conditions are generally favorable for crop development")
            
            return recommendations
            
        except Exception as e:
            logger.error("Error generating weather recommendations", error=str(e))
            return ["Unable to generate weather-based recommendations"]


# Global weather service instance
weather_service = WeatherService()