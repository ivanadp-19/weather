"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import WeatherCard from "./weather-card"
import CityNotFoundModal from "./modal-city"
import { Loader2 } from "lucide-react"

// Define types for API responses
interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
  };
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
    };
    humidity: number;
    wind_kph: number;
    feelslike_c: number;
    uv: number;
    last_updated: string;
  };
}

interface WeatherCardData {
  id: string;
  city: string;
  region: string;
  country: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  conditionIcon: string;
  humidity: number;
  windSpeed: number;
  uv: number;
  lastUpdated: string;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [weatherCards, setWeatherCards] = useState<WeatherCardData[]>([])
  const [showModal, setShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  // Use the fixed API key
  const apiKey = "96d400426943462ca35172238250303"

  // Load saved weather cards from localStorage on component mount
  useEffect(() => {
    const savedCards = localStorage.getItem("weatherCards")
    if (savedCards) {
      try {
        setWeatherCards(JSON.parse(savedCards))
      } catch (e) {
        console.error("Failed to load saved weather cards:", e)
      }
    }
  }, [])

  // Save weather cards to localStorage when they change
  useEffect(() => {
    if (weatherCards.length > 0) {
      localStorage.setItem("weatherCards", JSON.stringify(weatherCards))
    }
  }, [weatherCards])

  // Function to refresh all weather cards with latest data
  const refreshAllCards = async () => {
    setIsLoading(true)
    
    try {
      const updatedCards = await Promise.all(
        weatherCards.map(async (card) => {
          try {
            const data = await fetchWeatherData(card.city)
            return {
              ...card,
              temperature: data.current.temp_c,
              feelsLike: data.current.feelslike_c,
              condition: data.current.condition.text,
              conditionIcon: data.current.condition.icon,
              humidity: data.current.humidity,
              windSpeed: data.current.wind_kph,
              uv: data.current.uv,
              lastUpdated: data.current.last_updated
            }
          } catch (error) {
            // If we can't update a card, keep the old data
            return card
          }
        })
      )
      
      setWeatherCards(updatedCards)
    } catch (error) {
      console.error("Failed to refresh weather cards:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch weather data from the API
  const fetchWeatherData = async (city: string): Promise<WeatherData> => {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}&aqi=no`
    )

    if (!response.ok) {
      if (response.status === 400 || response.status === 404) {
        throw new Error("City not found")
      }
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!searchQuery.trim()) return
    
    setIsLoading(true)
    
    try {
      const data = await fetchWeatherData(searchQuery)
      
      // Check if this city is already in our cards
      const existingCardIndex = weatherCards.findIndex(
        card => card.city.toLowerCase() === data.location.name.toLowerCase()
      )
      
      const newCard: WeatherCardData = {
        id: existingCardIndex >= 0 ? weatherCards[existingCardIndex].id : Date.now().toString(),
        city: data.location.name,
        region: data.location.region,
        country: data.location.country,
        temperature: data.current.temp_c,
        feelsLike: data.current.feelslike_c,
        condition: data.current.condition.text,
        conditionIcon: data.current.condition.icon,
        humidity: data.current.humidity,
        windSpeed: data.current.wind_kph,
        uv: data.current.uv,
        lastUpdated: data.current.last_updated
      }
      
      if (existingCardIndex >= 0) {
        // Update existing card
        setWeatherCards(prev => 
          prev.map((card, index) => index === existingCardIndex ? newCard : card)
        )
      } else {
        // Add new card at the beginning
        setWeatherCards(prev => [newCard, ...prev])
      }
      
    } catch (error) {
      console.error("Error fetching weather:", error)
      setShowModal(true)
    } finally {
      setIsLoading(false)
      setSearchQuery("")
    }
  }

  const removeCard = (id: string) => {
    setWeatherCards(prev => {
      const updatedCards = prev.filter(card => card.id !== id)
      localStorage.setItem("weatherCards", JSON.stringify(updatedCards))
      return updatedCards
    })
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Weather Dashboard</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={refreshAllCards}
            disabled={isLoading || weatherCards.length === 0}
            className="text-sm"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh All"}
          </Button>
        </div>
      </div>
      
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search for a city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit" disabled={isLoading || !searchQuery.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
          </Button>
        </div>
      </form>

      {weatherCards.length === 0 ? (
        <div className="text-center p-10 border border-dashed rounded-lg">
          <p className="text-muted-foreground">Search for a city to see weather information</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {weatherCards.map((card) => (
            <WeatherCard
              key={card.id}
              city={card.city}
              region={card.region}
              country={card.country}
              temperature={card.temperature}
              feelsLike={card.feelsLike}
              condition={card.condition}
              conditionIcon={card.conditionIcon}
              humidity={card.humidity}
              windSpeed={card.windSpeed}
              uv={card.uv}
              lastUpdated={card.lastUpdated}
              onRemove={() => removeCard(card.id)}
            />
          ))}
        </div>
      )}

      <CityNotFoundModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  )
}