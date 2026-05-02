import { createFileRoute } from '@tanstack/react-router'
import { GroupBookingPage } from '../../features/group-booking/pages/GroupBookingPage'

export const Route = createFileRoute('/group-booking')({
  component: GroupBookingPage,
})
