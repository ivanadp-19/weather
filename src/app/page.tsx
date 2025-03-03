"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import WeatherCard from "./weather-card"
import CityNotFoundModal from "./modal-city"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [weatherCards, setWeatherCards] = useState<
    Array<{ id: string; city: string; temperature: number; condition: string }>
  >([])
  const [showModal, setShowModal] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would call an actual weather API here
    const cityExists = Math.random() > 0.3 // Simulate API call with 70% chance of city existing

    if (cityExists) {
      const newCard = {
        id: Date.now().toString(),
        city: searchQuery,
        temperature: Math.floor(Math.random() * 30) + 10, // Random temperature between 10 and 40
        condition: ["Sunny", "Cloudy", "Rainy", "Windy"][Math.floor(Math.random() * 4)],
      }
      setWeatherCards((prev) => [newCard, ...prev])
    } else {
      setShowModal(true)
    }
    setSearchQuery("")
  }

  const removeCard = (id: string) => {
    setWeatherCards((prev) => prev.filter((card) => card.id !== id))
  }

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search for a city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit">Search</Button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {weatherCards.map((card) => (
          <WeatherCard
            key={card.id}
            city={card.city}
            temperature={card.temperature}
            condition={card.condition}
            onRemove={() => removeCard(card.id)}
          />
        ))}
      </div>

      <CityNotFoundModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  )
}

