import { DashboardLayout } from '@/widgets/dashboard-layout'
import { TravelMap } from '@/widgets/travel-map';

export const DashboardPage = () => {
  return (
    <DashboardLayout>
      <div style={{ height: 'calc(100vh - 64px)' }}>
        <TravelMap />
      </div>
    </DashboardLayout>
  )
}