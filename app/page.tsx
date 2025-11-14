"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, TrendingUp, Users, Euro, Sparkles, Award } from 'lucide-react'
import { subDays, startOfMonth, isWithinInterval, parseISO } from "date-fns"
import { de } from "date-fns/locale"
import { cn } from "@/lib/utils"

type EmploymentType = "Minijob" | "Teilzeit" | "Vollzeit"
type PerformanceTier = "top" | "middle" | "bottom"

interface PromoterMetrics {
  promoterId: number
  employmentType: EmploymentType
  overallTier: PerformanceTier
  keinBedarf: number
  neukunden: number
  proben: number
  gesamtarbeitszeit: number
  haushalteJeStunde: number
  neukundenquote: number
  neukundenJeStunde: number
  neukundenJeStundeVZ: number
  neukundenJeStundeGAZ: number
}

// Mock-Daten für Promoter
const promoters = [
  { id: 1, name: "Anna Schmidt" },
  { id: 2, name: "Max Müller" },
  { id: 3, name: "Lisa Weber" },
  { id: 4, name: "Tom Fischer" },
]

const promoterMetrics: PromoterMetrics[] = [
  {
    promoterId: 1,
    employmentType: "Teilzeit",
    overallTier: "top",
    keinBedarf: 65,
    neukunden: 28,
    proben: 45,
    gesamtarbeitszeit: 85,
    haushalteJeStunde: 7.2,
    neukundenquote: 43,
    neukundenJeStunde: 3.3,
    neukundenJeStundeVZ: 2.6,
    neukundenJeStundeGAZ: 3.3,
  },
  {
    promoterId: 2,
    employmentType: "Vollzeit",
    overallTier: "top",
    keinBedarf: 92,
    neukunden: 35,
    proben: 78,
    gesamtarbeitszeit: 120,
    haushalteJeStunde: 8.5,
    neukundenquote: 38,
    neukundenJeStunde: 2.9,
    neukundenJeStundeVZ: 2.8,
    neukundenJeStundeGAZ: 3.1,
  },
  {
    promoterId: 3,
    employmentType: "Minijob",
    overallTier: "bottom",
    keinBedarf: 48,
    neukunden: 15,
    proben: 32,
    gesamtarbeitszeit: 65,
    haushalteJeStunde: 5.8,
    neukundenquote: 31,
    neukundenJeStunde: 2.3,
    neukundenJeStundeVZ: 2.1,
    neukundenJeStundeGAZ: 2.5,
  },
  {
    promoterId: 4,
    employmentType: "Vollzeit",
    overallTier: "top",
    keinBedarf: 88,
    neukunden: 42,
    proben: 95,
    gesamtarbeitszeit: 135,
    haushalteJeStunde: 9.2,
    neukundenquote: 48,
    neukundenJeStunde: 3.1,
    neukundenJeStundeVZ: 2.9,
    neukundenJeStundeGAZ: 3.4,
  },
]

const mockCustomers = [
  // Anna Schmidt - 28 Kunden im Oktober
  { id: 1, promoterId: 1, name: "Familie Becker", phone: "+49 151 12345678", date: "2025-10-01" },
  { id: 2, promoterId: 1, name: "Herr Schneider", phone: "+49 152 23456789", date: "2025-10-02" },
  { id: 3, promoterId: 1, name: "Frau Hoffmann", phone: "+49 160 34567890", date: "2025-10-03" },
  { id: 4, promoterId: 1, name: "Familie Wagner", phone: "+49 170 45678901", date: "2025-10-04" },
  { id: 5, promoterId: 1, name: "Herr Klein", phone: "+49 171 56789012", date: "2025-10-05" },
  { id: 6, promoterId: 1, name: "Frau Zimmermann", phone: "+49 172 67890123", date: "2025-10-08" },
  { id: 7, promoterId: 1, name: "Familie Braun", phone: "+49 173 78901234", date: "2025-10-09" },
  { id: 8, promoterId: 1, name: "Herr Krüger", phone: "+49 174 89012345", date: "2025-10-10" },
  { id: 9, promoterId: 1, name: "Frau Schmitt", phone: "+49 175 90123456", date: "2025-10-11" },
  { id: 10, promoterId: 1, name: "Familie Lehmann", phone: "+49 176 01234567", date: "2025-10-12" },
  { id: 11, promoterId: 1, name: "Herr Koch", phone: "+49 177 12345670", date: "2025-10-13" },
  { id: 12, promoterId: 1, name: "Frau Bauer", phone: "+49 178 23456701", date: "2025-10-14" },
  { id: 13, promoterId: 1, name: "Familie Richter", phone: "+49 179 34567012", date: "2025-10-15" },
  { id: 14, promoterId: 1, name: "Herr Schröder", phone: "+49 151 45670123", date: "2025-10-16" },
  { id: 15, promoterId: 1, name: "Frau Neumann", phone: "+49 152 56701234", date: "2025-10-17" },
  { id: 16, promoterId: 1, name: "Familie Schwarz", phone: "+49 160 67012345", date: "2025-10-18" },
  { id: 17, promoterId: 1, name: "Herr Zimmermann", phone: "+49 170 70123456", date: "2025-10-19" },
  { id: 18, promoterId: 1, name: "Frau Peters", phone: "+49 171 80123456", date: "2025-10-20" },
  { id: 19, promoterId: 1, name: "Familie Maier", phone: "+49 172 90123456", date: "2025-10-21" },
  { id: 20, promoterId: 1, name: "Herr Schulze", phone: "+49 173 10123456", date: "2025-10-22" },
  { id: 21, promoterId: 1, name: "Frau Meier", phone: "+49 174 20123456", date: "2025-10-23" },
  { id: 22, promoterId: 1, name: "Familie Becker", phone: "+49 175 30123456", date: "2025-10-24" },
  { id: 23, promoterId: 1, name: "Herr Lange", phone: "+49 176 40123456", date: "2025-10-25" },
  { id: 24, promoterId: 1, name: "Frau Wolff", phone: "+49 177 50123456", date: "2025-10-25" },
  { id: 25, promoterId: 1, name: "Familie Krämer", phone: "+49 178 60123456", date: "2025-10-26" },
  { id: 26, promoterId: 1, name: "Herr Vogel", phone: "+49 179 70123456", date: "2025-10-26" },
  { id: 27, promoterId: 1, name: "Frau Berger", phone: "+49 151 80123456", date: "2025-10-26" },
  { id: 28, promoterId: 1, name: "Familie Hartmann", phone: "+49 152 90123456", date: "2025-10-26" },

  // Max Müller - 35 Kunden im Oktober
  { id: 29, promoterId: 2, name: "Familie Meyer", phone: "+49 151 11111111", date: "2025-10-01" },
  { id: 30, promoterId: 2, name: "Herr Schulz", phone: "+49 152 22222222", date: "2025-10-02" },
  { id: 31, promoterId: 2, name: "Frau Lange", phone: "+49 160 33333333", date: "2025-10-03" },
  { id: 32, promoterId: 2, name: "Familie Wolff", phone: "+49 170 44444444", date: "2025-10-04" },
  { id: 33, promoterId: 2, name: "Herr Vogel", phone: "+49 171 55555555", date: "2025-10-05" },
  { id: 34, promoterId: 2, name: "Frau Berger", phone: "+49 172 66666666", date: "2025-10-06" },
  { id: 35, promoterId: 2, name: "Familie Hartmann", phone: "+49 173 77777777", date: "2025-10-07" },
  { id: 36, promoterId: 2, name: "Herr Krause", phone: "+49 174 88888888", date: "2025-10-08" },
  { id: 37, promoterId: 2, name: "Frau Köhler", phone: "+49 175 99999999", date: "2025-10-09" },
  { id: 38, promoterId: 2, name: "Familie Walter", phone: "+49 176 10101010", date: "2025-10-10" },
  { id: 39, promoterId: 2, name: "Herr König", phone: "+49 177 20202020", date: "2025-10-11" },
  { id: 40, promoterId: 2, name: "Frau Huber", phone: "+49 178 30303030", date: "2025-10-12" },
  { id: 41, promoterId: 2, name: "Familie Herrmann", phone: "+49 179 40404040", date: "2025-10-13" },
  { id: 42, promoterId: 2, name: "Herr Schäfer", phone: "+49 151 50505050", date: "2025-10-14" },
  { id: 43, promoterId: 2, name: "Frau Kaiser", phone: "+49 152 60606060", date: "2025-10-15" },
  { id: 44, promoterId: 2, name: "Familie Otto", phone: "+49 160 70707070", date: "2025-10-16" },
  { id: 45, promoterId: 2, name: "Herr Sommer", phone: "+49 170 80808080", date: "2025-10-17" },
  { id: 46, promoterId: 2, name: "Frau Möller", phone: "+49 171 90909090", date: "2025-10-18" },
  { id: 47, promoterId: 2, name: "Familie Becker", phone: "+49 172 11223344", date: "2025-10-19" },
  { id: 48, promoterId: 2, name: "Herr Werner", phone: "+49 173 22334455", date: "2025-10-20" },
  { id: 49, promoterId: 2, name: "Frau Fuchs", phone: "+49 174 33445566", date: "2025-10-21" },
  { id: 50, promoterId: 2, name: "Familie Engel", phone: "+49 175 44556677", date: "2025-10-22" },
  { id: 51, promoterId: 2, name: "Herr Arnold", phone: "+49 176 55667788", date: "2025-10-23" },
  { id: 52, promoterId: 2, name: "Frau Stein", phone: "+49 177 66778899", date: "2025-10-24" },
  { id: 53, promoterId: 2, name: "Familie Ritter", phone: "+49 178 77889900", date: "2025-10-24" },
  { id: 54, promoterId: 2, name: "Herr Bauer", phone: "+49 179 88990011", date: "2025-10-25" },
  { id: 55, promoterId: 2, name: "Frau Scholz", phone: "+49 151 99001122", date: "2025-10-25" },
  { id: 56, promoterId: 2, name: "Familie Günther", phone: "+49 152 10112233", date: "2025-10-25" },
  { id: 57, promoterId: 2, name: "Herr Kraus", phone: "+49 160 21223344", date: "2025-10-26" },
  { id: 58, promoterId: 2, name: "Frau Böhm", phone: "+49 170 32334455", date: "2025-10-26" },
  { id: 59, promoterId: 2, name: "Familie Schuster", phone: "+49 171 43445566", date: "2025-10-26" },
  { id: 60, promoterId: 2, name: "Herr Keller", phone: "+49 172 54556677", date: "2025-10-26" },
  { id: 61, promoterId: 2, name: "Frau Groß", phone: "+49 173 65667788", date: "2025-10-26" },
  { id: 62, promoterId: 2, name: "Familie Roth", phone: "+49 174 76778899", date: "2025-10-26" },
  { id: 63, promoterId: 2, name: "Herr Pfeiffer", phone: "+49 175 87889900", date: "2025-10-26" },

  // Lisa Weber - 15 Kunden im Oktober
  { id: 64, promoterId: 3, name: "Familie Frank", phone: "+49 151 11122233", date: "2025-10-05" },
  { id: 65, promoterId: 3, name: "Herr Jung", phone: "+49 152 22233344", date: "2025-10-07" },
  { id: 66, promoterId: 3, name: "Frau Hahn", phone: "+49 160 33344455", date: "2025-10-09" },
  { id: 67, promoterId: 3, name: "Familie Schubert", phone: "+49 170 44455566", date: "2025-10-11" },
  { id: 68, promoterId: 3, name: "Herr Winkler", phone: "+49 171 55566677", date: "2025-10-13" },
  { id: 69, promoterId: 3, name: "Frau Lorenz", phone: "+49 172 66677788", date: "2025-10-15" },
  { id: 70, promoterId: 3, name: "Familie Baumann", phone: "+49 173 77788899", date: "2025-10-17" },
  { id: 71, promoterId: 3, name: "Herr Böhm", phone: "+49 174 88899900", date: "2025-10-19" },
  { id: 72, promoterId: 3, name: "Frau Schuster", phone: "+49 175 99900011", date: "2025-10-21" },
  { id: 73, promoterId: 3, name: "Familie Keller", phone: "+49 176 00011122", date: "2025-10-22" },
  { id: 74, promoterId: 3, name: "Herr Groß", phone: "+49 177 11122334", date: "2025-10-23" },
  { id: 75, promoterId: 3, name: "Frau Roth", phone: "+49 178 22233445", date: "2025-10-24" },
  { id: 76, promoterId: 3, name: "Familie Pfeiffer", phone: "+49 179 33344556", date: "2025-10-25" },
  { id: 77, promoterId: 3, name: "Herr Vogt", phone: "+49 151 44455667", date: "2025-10-26" },
  { id: 78, promoterId: 3, name: "Frau Seidel", phone: "+49 152 55566778", date: "2025-10-26" },

  // Tom Fischer - 42 Kunden im Oktober
  { id: 79, promoterId: 4, name: "Familie Groß", phone: "+49 151 99988877", date: "2025-10-01" },
  { id: 80, promoterId: 4, name: "Herr Roth", phone: "+49 152 88877766", date: "2025-10-02" },
  { id: 81, promoterId: 4, name: "Frau Pfeiffer", phone: "+49 160 77766655", date: "2025-10-03" },
  { id: 82, promoterId: 4, name: "Familie Vogt", phone: "+49 170 66655544", date: "2025-10-04" },
  { id: 83, promoterId: 4, name: "Herr Seidel", phone: "+49 171 55544433", date: "2025-10-05" },
  { id: 84, promoterId: 4, name: "Frau Brandt", phone: "+49 172 44433322", date: "2025-10-06" },
  { id: 85, promoterId: 4, name: "Familie Dietrich", phone: "+49 173 33322211", date: "2025-10-07" },
  { id: 86, promoterId: 4, name: "Herr Kuhn", phone: "+49 174 22211100", date: "2025-10-08" },
  { id: 87, promoterId: 4, name: "Frau Busch", phone: "+49 175 11100099", date: "2025-10-09" },
  { id: 88, promoterId: 4, name: "Familie Horn", phone: "+49 176 00099988", date: "2025-10-10" },
  { id: 89, promoterId: 4, name: "Herr Albrecht", phone: "+49 177 99988776", date: "2025-10-11" },
  { id: 90, promoterId: 4, name: "Frau Lindner", phone: "+49 178 88877665", date: "2025-10-12" },
  { id: 91, promoterId: 4, name: "Familie Mayer", phone: "+49 179 77766554", date: "2025-10-13" },
  { id: 92, promoterId: 4, name: "Herr Weiß", phone: "+49 151 66655443", date: "2025-10-14" },
  { id: 93, promoterId: 4, name: "Frau Simon", phone: "+49 152 55544332", date: "2025-10-15" },
  { id: 94, promoterId: 4, name: "Familie Ludwig", phone: "+49 160 44433221", date: "2025-10-16" },
  { id: 95, promoterId: 4, name: "Herr Heinrich", phone: "+49 170 33322110", date: "2025-10-17" },
  { id: 96, promoterId: 4, name: "Frau Schreiber", phone: "+49 171 22211009", date: "2025-10-18" },
  { id: 97, promoterId: 4, name: "Familie Krämer", phone: "+49 172 11100998", date: "2025-10-19" },
  { id: 98, promoterId: 4, name: "Herr Graf", phone: "+49 173 10099887", date: "2025-10-20" },
  { id: 99, promoterId: 4, name: "Frau Schulte", phone: "+49 174 09988776", date: "2025-10-21" },
  { id: 100, promoterId: 4, name: "Familie Jäger", phone: "+49 175 98877665", date: "2025-10-22" },
  { id: 101, promoterId: 4, name: "Herr Kühn", phone: "+49 176 87766554", date: "2025-10-22" },
  { id: 102, promoterId: 4, name: "Frau Lemke", phone: "+49 177 76655443", date: "2025-10-23" },
  { id: 103, promoterId: 4, name: "Familie Krüger", phone: "+49 178 65544332", date: "2025-10-23" },
  { id: 104, promoterId: 4, name: "Herr Nowak", phone: "+49 179 54433221", date: "2025-10-24" },
  { id: 105, promoterId: 4, name: "Frau Schmid", phone: "+49 151 43322110", date: "2025-10-24" },
  { id: 106, promoterId: 4, name: "Familie Stein", phone: "+49 152 32211009", date: "2025-10-24" },
  { id: 107, promoterId: 4, name: "Herr Brandt", phone: "+49 160 21100998", date: "2025-10-25" },
  { id: 108, promoterId: 4, name: "Frau Krause", phone: "+49 170 10099887", date: "2025-10-25" },
  { id: 109, promoterId: 4, name: "Familie Meier", phone: "+49 171 09988776", date: "2025-10-25" },
  { id: 110, promoterId: 4, name: "Herr Lehmann", phone: "+49 172 98877665", date: "2025-10-25" },
  { id: 111, promoterId: 4, name: "Frau Koch", phone: "+49 173 87766554", date: "2025-10-25" },
  { id: 112, promoterId: 4, name: "Familie Bauer", phone: "+49 174 76655443", date: "2025-10-26" },
  { id: 113, promoterId: 4, name: "Herr Richter", phone: "+49 175 65544332", date: "2025-10-26" },
  { id: 114, promoterId: 4, name: "Frau Schröder", phone: "+49 176 54433221", date: "2025-10-26" },
  { id: 115, promoterId: 4, name: "Familie Neumann", phone: "+49 177 43322110", date: "2025-10-26" },
  { id: 116, promoterId: 4, name: "Herr Schwarz", phone: "+49 178 32211009", date: "2025-10-26" },
  { id: 117, promoterId: 4, name: "Frau Zimmermann", phone: "+49 179 21100998", date: "2025-10-26" },
  { id: 118, promoterId: 4, name: "Familie Braun", phone: "+49 151 10099887", date: "2025-10-26" },
  { id: 119, promoterId: 4, name: "Herr Krüger", phone: "+49 152 09988776", date: "2025-10-26" },
  { id: 120, promoterId: 4, name: "Frau Schmitt", phone: "+49 160 98877665", date: "2025-10-26" },
]

const COMMISSION_PER_CUSTOMER = 20
const COMMISSION_PER_PROBE = 2
const HOURLY_WAGE = 15
const MONTHLY_TARGET = 20
const MONTHLY_BONUS = 50
const GAMIFICATION_THRESHOLD = 40
const GAMIFICATION_BONUS = 20

// CHANGE: Updated bonus system to commission tiers based on customer count
const COMMISSION_TIERS = [
  { customers: 40, commissionPerCustomer: 7.5, label: "7,50€ je NK" },
  { customers: 60, commissionPerCustomer: 10, label: "10€ je NK" },
]

function getTierBadge(tier: PerformanceTier) {
  switch (tier) {
    case "top":
      return { label: "Bestes Drittel", className: "bg-green-500/10 text-green-700 border-green-500/20" }
    case "middle":
      return { label: "Mittleres Drittel", className: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20" }
    case "bottom":
      return { label: "Unteres Drittel", className: "bg-red-500/10 text-red-700 border-red-500/20" }
  }
}

function getOverallTierBadge(tier: PerformanceTier) {
  switch (tier) {
    case "top":
      return {
        label: "Bestes Drittel",
        className: "bg-green-500/10 text-green-700 border-green-500/20",
        icon: "🏆",
      }
    case "middle":
      return {
        label: "Mittleres Drittel",
        className: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
        icon: "⭐",
      }
    case "bottom":
      return {
        label: "Unteres Drittel",
        className: "bg-red-500/10 text-red-700 border-red-500/20",
        icon: "📊",
      }
  }
}

export default function PromoterDashboard() {
  const [selectedPromoter, setSelectedPromoter] = useState<number>(1)
  const [timeRange, setTimeRange] = useState<string>("month")
  const [customDateFrom, setCustomDateFrom] = useState<Date>()
  const [customDateTo, setCustomDateTo] = useState<Date>()
  const [showGamificationPopup, setShowGamificationPopup] = useState(false)

  const currentMetrics = promoterMetrics.find((m) => m.promoterId === selectedPromoter)

  const filteredCustomers = useMemo(() => {
    const today = new Date()
    let startDate: Date
    let endDate: Date = today

    switch (timeRange) {
      case "day":
        startDate = today
        break
      case "week":
        startDate = subDays(today, 7)
        break
      case "30days":
        startDate = subDays(today, 30)
        break
      case "month":
        startDate = startOfMonth(today)
        break
      case "custom":
        if (!customDateFrom || !customDateTo) return []
        startDate = customDateFrom
        endDate = customDateTo
        break
      default:
        startDate = startOfMonth(today)
    }

    return mockCustomers.filter((customer) => {
      if (customer.promoterId !== selectedPromoter) return false
      const customerDate = parseISO(customer.date)
      return isWithinInterval(customerDate, { start: startDate, end: endDate })
    })
  }, [selectedPromoter, timeRange, customDateFrom, customDateTo])

  const stats = useMemo(() => {
    const customerCount = filteredCustomers.length
    const commission = customerCount * COMMISSION_PER_CUSTOMER
    const targetProgress = (customerCount / MONTHLY_TARGET) * 100
    const bonus = customerCount >= MONTHLY_TARGET ? MONTHLY_BONUS : 0
    const gamificationBonus = customerCount >= GAMIFICATION_THRESHOLD ? GAMIFICATION_BONUS : 0
    const totalEarnings = commission + bonus + gamificationBonus

    let progressColor = "bg-red-500"
    if (targetProgress >= 85) {
      progressColor = "bg-green-500"
    } else if (targetProgress >= 50) {
      progressColor = "bg-yellow-500"
    }

    // CHANGE: Calculate commission based on tier system
    let commissionPerCustomer = 0
    let currentTier = null
    let nextTier = COMMISSION_TIERS[0]

    for (let i = COMMISSION_TIERS.length - 1; i >= 0; i--) {
      if (customerCount >= COMMISSION_TIERS[i].customers) {
        commissionPerCustomer = COMMISSION_TIERS[i].commissionPerCustomer
        currentTier = COMMISSION_TIERS[i]
        nextTier = COMMISSION_TIERS[i + 1] || null
        break
      }
    }

    if (!currentTier && customerCount < COMMISSION_TIERS[0].customers) {
      nextTier = COMMISSION_TIERS[0]
    }

    const nextTierTarget = nextTier?.customers || COMMISSION_TIERS[COMMISSION_TIERS.length - 1].customers

    const earningsFromWorkTime = currentMetrics?.gesamtarbeitszeit * HOURLY_WAGE || 0
    const earningsFromCustomers = currentMetrics ? currentMetrics.neukunden * commissionPerCustomer : 0
    const earningsFromProbes = currentMetrics?.proben * COMMISSION_PER_PROBE || 0
    const earningsFromMilestones = 0 // No milestone bonuses in new system
    const totalEarningsNew = earningsFromWorkTime + earningsFromCustomers + earningsFromProbes + earningsFromMilestones

    return {
      customerCount,
      commission,
      targetProgress: Math.min(targetProgress, 100),
      progressColor,
      bonus,
      totalEarnings,
      remainingToTarget: Math.max(MONTHLY_TARGET - customerCount, 0),
      gamificationBonus,
      currentTier,
      nextTier,
      nextTierTarget,
      commissionPerCustomer,
      earningsFromWorkTime,
      earningsFromCustomers,
      earningsFromProbes,
      earningsFromMilestones,
      totalEarningsNew,
    }
  }, [filteredCustomers, currentMetrics])

  const selectedPromoterName = promoters.find((p) => p.id === selectedPromoter)?.name || ""

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Promoter Dashboard</h1>
              <p className="text-sm text-muted-foreground">Bäckerwaren Lieferservice</p>
            </div>
            <Button
              onClick={() => setShowGamificationPopup(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Gamification
            </Button>
          </div>
        </div>
      </header>

      <Dialog open={showGamificationPopup} onOpenChange={setShowGamificationPopup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-primary">
              🎉 Herzlichen Glückwunsch! 🎉
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              Sie haben einen besonderen Meilenstein erreicht!
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-6 py-6">
            <div className="text-6xl">🏆</div>
            <div className="text-center">
              <p className="mb-2 text-lg font-semibold text-foreground">40+ Kunden gewonnen!</p>
              <p className="text-sm text-muted-foreground">
                Sie haben die 40-Kunden-Marke überschritten und erhalten nun für alle gewonnenen Neukunden 7,50€ je
                Neukunde. Dies entspricht bei 40 Neukunden einem Mehrverdienst von 100€.
              </p>
            </div>
            <div className="w-full rounded-lg border-2 border-primary bg-primary/10 p-6 text-center">
              <div className="mb-2 text-sm font-medium text-muted-foreground">Insgesamt verdienter Bonus</div>
              <div className="text-4xl font-bold text-primary">300€</div>
            </div>
            <p className="text-center text-sm font-medium text-foreground">
              Weiter so! Ab 60 Kunden steigt deine Provision sogar auf 10€ je Neukunde!
            </p>
            <div className="flex gap-2 text-2xl">🎊 🎈 ✨ 🌟 🎁</div>
            <Button
              onClick={() => setShowGamificationPopup(false)}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              size="lg"
            >
              Weiter so!
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium text-foreground">Promoter auswählen</label>
            <Select value={selectedPromoter.toString()} onValueChange={(value) => setSelectedPromoter(Number(value))}>
              <SelectTrigger className="w-full md:w-[280px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {promoters.map((promoter) => (
                  <SelectItem key={promoter.id} value={promoter.id.toString()}>
                    {promoter.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium text-foreground">Zeitraum</label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={timeRange === "day" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("day")}
              >
                1 Tag
              </Button>
              <Button
                variant={timeRange === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("week")}
              >
                1 Woche
              </Button>
              <Button
                variant={timeRange === "month" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("month")}
              >
                Seit Monatsanfang
              </Button>
              <Button
                variant={timeRange === "30days" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("30days")}
              >
                30 Tage
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={timeRange === "custom" ? "default" : "outline"} size="sm">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Benutzerdefiniert
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <div className="p-4">
                    <div className="mb-4">
                      <label className="mb-2 block text-sm font-medium">Von</label>
                      <Calendar
                        mode="single"
                        selected={customDateFrom}
                        onSelect={(date) => {
                          setCustomDateFrom(date)
                          if (date && customDateTo) {
                            setTimeRange("custom")
                          }
                        }}
                        locale={de}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">Bis</label>
                      <Calendar
                        mode="single"
                        selected={customDateTo}
                        onSelect={(date) => {
                          setCustomDateTo(date)
                          if (customDateFrom && date) {
                            setTimeRange("custom")
                          }
                        }}
                        locale={de}
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {currentMetrics && (
          <Card className="mb-6 border-border bg-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Ihre Leistungsklassifizierung</div>
                    <div className="text-lg font-semibold text-foreground">
                      Vergleichsgruppe: {currentMetrics.employmentType}
                    </div>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={cn("px-4 py-2 text-base", getOverallTierBadge(currentMetrics.overallTier).className)}
                >
                  <span className="mr-2">{getOverallTierBadge(currentMetrics.overallTier).icon}</span>
                  {getOverallTierBadge(currentMetrics.overallTier).label}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {timeRange === "month" && (
          <>
            <Card className="mb-6 border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Monatsziele</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Provisionsstufen und Ihr aktueller Fortschritt
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* Progress bar background */}
                  <div className="h-8 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary transition-all duration-500"
                      style={{
                        width: `${Math.min((stats.customerCount / COMMISSION_TIERS[COMMISSION_TIERS.length - 1].customers) * 100, 100)}%`,
                      }}
                    />
                  </div>

                  {/* Milestone markers */}
                  <div className="relative mt-4">
                    {COMMISSION_TIERS.map((tier, index) => {
                      const position = (tier.customers / COMMISSION_TIERS[COMMISSION_TIERS.length - 1].customers) * 100
                      const isReached = stats.customerCount >= tier.customers
                      const isCurrent =
                        stats.customerCount >= tier.customers &&
                        (index === COMMISSION_TIERS.length - 1 ||
                          stats.customerCount < COMMISSION_TIERS[index + 1]?.customers)

                      return (
                        <div
                          key={tier.customers}
                          className="absolute -translate-x-1/2"
                          style={{ left: `${position}%`, top: "-2.5rem" }}
                        >
                          <div className="flex flex-col items-center">
                            <div
                              className={cn(
                                "mb-1 flex h-6 w-6 items-center justify-center rounded-full border-2 text-xs font-bold",
                                isReached
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-muted-foreground bg-background text-muted-foreground",
                                isCurrent && "ring-2 ring-primary ring-offset-2",
                              )}
                            >
                              {isReached ? "✓" : ""}
                            </div>
                            <div className="whitespace-nowrap text-center">
                              <div
                                className={cn(
                                  "text-xs font-semibold",
                                  isReached ? "text-primary" : "text-muted-foreground",
                                )}
                              >
                                {tier.customers} NK
                              </div>
                              <div className={cn("text-xs", isReached ? "text-primary" : "text-muted-foreground")}>
                                {tier.label}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Current status text */}
                <div className="mt-8 text-center">
                  {stats.currentTier ? (
                    <p className="text-sm text-muted-foreground">
                      Sie erhalten aktuell{" "}
                      <span className="font-semibold text-primary">{stats.commissionPerCustomer}€ pro Neukunde</span>!
                      {stats.nextTier && (
                        <>
                          {" "}
                          Noch <span className="font-semibold">{stats.nextTier.customers - stats.customerCount}</span>{" "}
                          Kunden bis zur nächsten Provisionsstufe von{" "}
                          <span className="font-semibold text-primary">
                            {stats.nextTier.commissionPerCustomer}€ pro Neukunde
                          </span>
                          .
                        </>
                      )}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Du erhältst ab 40 NK 7,50€ Provision für ALLE Neukunden
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6 border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Nächstes Ziel</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {stats.nextTier
                    ? `Noch ${stats.nextTier.customers - stats.customerCount} Kunden bis ${stats.nextTier.label}`
                    : "Höchstes Ziel erreicht! 🎉"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">
                      {stats.customerCount} / {stats.nextTierTarget} Kunden
                    </span>
                    <span className="text-muted-foreground">
                      {((stats.customerCount / stats.nextTierTarget) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-4 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn("h-full transition-all duration-500", stats.progressColor)}
                      style={{ width: `${Math.min((stats.customerCount / stats.nextTierTarget) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-lg border border-border bg-background p-4">
                    <div className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
                      <Euro className="h-4 w-4" />
                      Verdienst aus Arbeitszeit
                    </div>
                    <div className="text-2xl font-bold text-foreground">{stats.earningsFromWorkTime}€</div>
                    <div className="text-xs text-muted-foreground">
                      {HOURLY_WAGE}€/h × {currentMetrics?.gesamtarbeitszeit || 0}h
                    </div>
                  </div>

                  <div className="rounded-lg border border-border bg-background p-4">
                    <div className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      Verdienst aus Neukundenprovision
                    </div>
                    <div className="text-2xl font-bold text-foreground">{stats.earningsFromCustomers}€</div>
                    <div className="text-xs text-muted-foreground">
                      {stats.commissionPerCustomer}€ × {currentMetrics?.neukunden || 0} Kunden
                    </div>
                  </div>

                  <div className="rounded-lg border border-border bg-background p-4">
                    <div className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      Verdienst aus Probenprovision
                    </div>
                    <div className="text-2xl font-bold text-foreground">{stats.earningsFromProbes}€</div>
                    <div className="text-xs text-muted-foreground">
                      {COMMISSION_PER_PROBE}€ × {currentMetrics?.proben || 0} Proben
                    </div>
                  </div>

                  <div className="rounded-lg border border-border bg-primary p-4">
                    <div className="mb-1 flex items-center gap-2 text-sm text-primary-foreground/80">
                      <Sparkles className="h-4 w-4" />
                      Gesamt
                    </div>
                    <div className="text-2xl font-bold text-primary-foreground">{stats.totalEarningsNew}€</div>
                    <div className="text-xs text-primary-foreground/80">Gesamtverdienst</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {timeRange !== "month" && (
          <Card className="mb-6 border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Übersicht</CardTitle>
              <CardDescription className="text-muted-foreground">
                Gewonnene Kunden im ausgewählten Zeitraum
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-border bg-background p-4">
                  <div className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    Kunden
                  </div>
                  <div className="text-2xl font-bold text-foreground">{stats.customerCount}</div>
                </div>

                <div className="rounded-lg border border-border bg-primary p-4">
                  <div className="mb-1 flex items-center gap-2 text-sm text-primary-foreground/80">
                    <Euro className="h-4 w-4" />
                    Provision
                  </div>
                  <div className="text-2xl font-bold text-primary-foreground">{stats.commission}€</div>
                  <div className="text-xs text-primary-foreground/80">{COMMISSION_PER_CUSTOMER}€ pro Kunde</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Kennzahlen</CardTitle>
            <CardDescription className="text-muted-foreground">
              Leistungsübersicht für {selectedPromoterName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentMetrics ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-lg border border-border bg-background p-3">
                  <div className="mb-2 text-xs font-medium text-muted-foreground">Neukunden</div>
                  <div className="text-xl font-bold text-foreground">{currentMetrics.neukunden}</div>
                </div>

                <div className="rounded-lg border border-border bg-background p-3">
                  <div className="mb-2 text-xs font-medium text-muted-foreground">Neukundenquote</div>
                  <div className="text-xl font-bold text-foreground">{currentMetrics.neukundenquote}%</div>
                  <div className="mt-1 text-xs text-muted-foreground">Ziel: &gt; 10%</div>
                </div>

                <div className="rounded-lg border border-border bg-background p-3">
                  <div className="mb-2 text-xs font-medium text-muted-foreground">Neukunden je Stunde (VZ)</div>
                  <div className="text-xl font-bold text-foreground">{currentMetrics.neukundenJeStundeVZ.toFixed(1)}</div>
                  <div className="mt-1 text-xs text-muted-foreground">Ziel: &gt; 0,30</div>
                </div>

                <div className="rounded-lg border border-border bg-background p-3">
                  <div className="mb-2 text-xs font-medium text-muted-foreground">Neukunden je Stunde (GAZ)</div>
                  <div className="text-xl font-bold text-foreground">{currentMetrics.neukundenJeStundeGAZ.toFixed(1)}</div>
                  <div className="mt-1 text-xs text-muted-foreground">Ziel: &gt; 0,30</div>
                </div>

                <div className="rounded-lg border border-border bg-background p-3">
                  <div className="mb-2 text-xs font-medium text-muted-foreground">Haushalte je Stunde</div>
                  <div className="text-xl font-bold text-foreground">{currentMetrics.haushalteJeStunde.toFixed(1)}</div>
                  <div className="mt-1 text-xs text-muted-foreground">Ziel: &gt; 27</div>
                </div>

                <div className="rounded-lg border border-border bg-background p-3">
                  <div className="mb-2 text-xs font-medium text-muted-foreground">Gesamtarbeitszeit (h)</div>
                  <div className="text-xl font-bold text-foreground">{currentMetrics.gesamtarbeitszeit}</div>
                  <div className="mt-1 text-xs text-muted-foreground">Ziel: = 40h</div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">Keine Kennzahlen verfügbar.</div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
