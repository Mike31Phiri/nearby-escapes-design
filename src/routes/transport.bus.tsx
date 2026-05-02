import { createFileRoute } from '@tanstack/react-router'
import { BusBookingPage } from '../../features/bus-booking/pages/BusBookingPage'

export const Route = createFileRoute('/transport/bus')({
  component: BusBookingPage,
})
