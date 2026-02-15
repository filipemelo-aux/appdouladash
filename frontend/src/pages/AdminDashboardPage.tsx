
import React from 'react';
import StatCard from '../components/dashboard/StatCard';
import { useProfile } from '../auth/useProfile';

// --- MOCK DATA ---
interface Client {
  id: number;
  name: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}

interface Appointment {
  id: number;
  clientName: string;
  date: Date;
  status: 'completed' | 'scheduled' | 'canceled';
}

const mockClients: Client[] = [
  { id: 1, name: 'Juliana Paes', status: 'active', createdAt: new Date('2024-06-15') },
  { id: 2, name: 'Mariana Rios', status: 'active', createdAt: new Date('2024-05-20') },
  { id: 3, name: 'Fernanda Lima', status: 'active', createdAt: new Date('2024-07-01') },
  { id: 4, name: 'Ana Hickmann', status: 'inactive', createdAt: new Date('2024-04-10') },
  { id: 5, name: 'Sabrina Sato', status: 'active', createdAt: new Date('2024-07-05') },
  { id: 6, name: 'Grazi Massafera', status: 'active', createdAt: new Date('2023-11-30') },
  { id: 7, name: 'Deborah Secco', status: 'active', createdAt: new Date('2024-02-18') },
  { id: 8, name: 'Paolla Oliveira', status: 'active', createdAt: new Date('2024-07-12') },
  { id: 9, name: 'Isis Valverde', status: 'active', createdAt: new Date('2024-06-25') },
  { id: 10, name: 'Claudia Leitte', status: 'inactive', createdAt: new Date('2024-01-05') },
  { id: 11, name: 'Ivete Sangalo', status: 'active', createdAt: new Date('2024-07-11') },
  { id: 12, name: 'Taís Araújo', status: 'active', createdAt: new Date('2024-03-22') },
];

const mockAppointments: Appointment[] = [
  // This month
  { id: 1, clientName: 'Juliana Paes', date: new Date(new Date().setDate(2)), status: 'completed' },
  { id: 2, clientName: 'Mariana Rios', date: new Date(new Date().setDate(5)), status: 'completed' },
  { id: 3, clientName: 'Fernanda Lima', date: new Date(new Date().setDate(10)), status: 'completed' },
  { id: 4, clientName: 'Sabrina Sato', date: new Date(new Date().setDate(1)), status: 'completed' },
  { id: 5, clientName: 'Isis Valverde', date: new Date(), status: 'scheduled' },
  { id: 6, clientName: 'Paolla Oliveira', date: new Date(), status: 'scheduled' },
  { id: 11, clientName: 'Taís Araújo', date: new Date(), status: 'scheduled' },
  // Last month
  { id: 7, clientName: 'Grazi Massafera', date: new Date(new Date().setMonth(new Date().getMonth() - 1, 15)), status: 'completed' },
  { id: 8, clientName: 'Deborah Secco', date: new Date(new Date().setMonth(new Date().getMonth() - 1, 28)), status: 'completed' },
  { id: 9, clientName: 'Juliana Paes', date: new Date(new Date().setMonth(new Date().getMonth() - 1, 5)), status: 'completed' },
  // Old
  { id: 10, clientName: 'Ana Hickmann', date: new Date('2024-04-25'), status: 'completed' },
];

// --- CALCULATION LOGIC ---

const now = new Date();
const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
const today = new Date(now.setHours(0, 0, 0, 0));

const activeClientsCount = mockClients.filter(c => c.status === 'active').length;
const appointmentsThisMonthCount = mockAppointments.filter(a => a.date >= startOfThisMonth && a.status === 'completed').length;
const newClientsThisMonthCount = mockClients.filter(c => c.createdAt >= startOfThisMonth).length;

const appointmentsLastMonthCount = mockAppointments.filter(a => a.date >= startOfLastMonth && a.date <= endOfLastMonth && a.status === 'completed').length;
const activeClientsLastMonthCount = mockClients.filter(c => c.status === 'active' && c.createdAt < startOfThisMonth).length;

const calculateGrowth = (lastMonth: number, thisMonth: number) => {
  if (lastMonth === 0) return thisMonth > 0 ? '+100%' : '+0%';
  const growth = ((thisMonth - lastMonth) / lastMonth) * 100;
  return `${growth >= 0 ? '+' : ''}${growth.toFixed(1)}% em relação ao mês anterior`;
};

const clientGrowthIndicator = calculateGrowth(activeClientsLastMonthCount, activeClientsCount);
const appointmentsGrowthIndicator = calculateGrowth(appointmentsLastMonthCount, appointmentsThisMonthCount);
const newClientsLastWeek = mockClients.filter(c => c.createdAt >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)).length;

const appointmentsTodayCount = mockAppointments.filter(a => {
  const appointmentDate = new Date(a.date.setHours(0,0,0,0));
  return appointmentDate.getTime() === today.getTime() && a.status === 'scheduled';
}).length;

const recentActivities = mockAppointments
  .filter(a => a.status === 'completed')
  .sort((a, b) => b.date.getTime() - a.date.getTime())
  .slice(0, 3)
  .map(activity => ({
    id: activity.id,
    description: `Atendimento com "${activity.clientName}" foi concluído.`,
    time: activity.date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' }),
  }));


// --- ICONS ---
const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 01-9.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const UserPlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
    </svg>
);


// --- COMPONENT ---
const AdminDashboardPage: React.FC = () => {
  const { profile } = useProfile();

  return (
    <>
      {/* Hero Panel */}
      <div className="bg-brand-50 rounded-xl p-8 mb-8">
        <h1 className="text-2xl font-semibold text-brand-800">
          Bom dia, {profile?.name?.split(' ')[0]} 👋
        </h1>
        <p className="mt-1 text-sm text-brand-600">
          {appointmentsTodayCount > 0
            ? `Você tem ${appointmentsTodayCount} atendimentos agendados para hoje.`
            : 'Você não tem atendimentos agendados para hoje.'
          }
        </p>
      </div>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="CLIENTES ATIVOS" 
          value={activeClientsCount} 
          icon={<UsersIcon />}
          growthIndicator={clientGrowthIndicator}
          featured={true}
        />
        <StatCard 
          title="ATENDIMENTOS ESTE MÊS" 
          value={appointmentsThisMonthCount} 
          icon={<CalendarIcon />}
          growthIndicator={appointmentsGrowthIndicator}
        />
        <StatCard 
          title="NOVOS CADASTROS (MÊS)" 
          value={newClientsThisMonthCount}
          icon={<UserPlusIcon />}
          growthIndicator={`+${newClientsLastWeek} na última semana`}
        />
      </div>

      {/* Recent Activity Timeline */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold text-brand-800 mb-6">Atividade Recente</h2>
        <ul className="relative border-l border-brand-100 ml-2 space-y-10">
            {recentActivities.map((activity) => (
              <li key={activity.id} className="ml-7">
                <div className="absolute w-2.5 h-2.5 bg-brand-500 rounded-full mt-2 -left-[5.5px] border-2 border-white"></div>
                <p className="text-sm font-medium text-brand-800">{activity.description}</p>
                <p className="text-xs text-brand-500 mt-0.5">{activity.time}</p>
              </li>
            ))}
        </ul>
      </div>
    </>
  );
};

export default AdminDashboardPage;
