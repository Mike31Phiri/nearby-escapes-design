import { createFileRoute } from '@tanstack/react-router'
import { PackageBookingPage } from '../../features/package-booking/pages/PackageBookingPage'

export const Route = createFileRoute('/packages')({
  component: PackageBookingPage,
})
