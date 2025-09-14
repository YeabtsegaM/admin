import StatCard from '../ui/StatCard';

interface StatsData {
  totalShopOwners: { value: number };
  activeShopOwners: { value: number };
  totalShops: { value: number };
  activeShops: { value: number };
  totalCashiers: { value: number };
  activeCashiers: { value: number };
}

interface StatsGridProps {
  stats: StatsData;
}

export default function StatsGrid({ stats }: StatsGridProps) {
  const statCards = [
    {
      title: "Shop Owners",
      total: stats.totalShopOwners.value,
      active: stats.activeShopOwners.value,
      color: "green" as const,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      )
    },
    {
      title: "Shops",
      total: stats.totalShops.value,
      active: stats.activeShops.value,
      color: "green" as const,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      title: "Cashiers",
      total: stats.totalCashiers.value,
      active: stats.activeCashiers.value,
      color: "green" as const,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {statCards.map((card, index) => (
        <StatCard
          key={index}
          title={card.title}
          total={card.total}
          active={card.active}
          icon={card.icon}
          color={card.color}
        />
      ))}
    </div>
  );
} 