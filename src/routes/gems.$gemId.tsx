import { createFileRoute } from '@tanstack/react-router'
import { GemDetailPage } from '../../features/gem-booking/pages/GemDetailPage'

export const Route = createFileRoute('/gems/$gemId')({
  component: GemDetailPage,
})
