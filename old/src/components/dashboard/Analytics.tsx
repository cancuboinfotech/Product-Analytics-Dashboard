import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { useProductStore } from '@/store/useProductStore';
import styles from './Analytics.module.css';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#facc15', '#22c55e', '#0ea5e9'];

export const Analytics: React.FC = () => {
  const { filteredProducts } = useProductStore();

  const categoryData = useMemo(() => {
    const data: Record<string, { count: number; totalPrice: number }> = {};
    
    filteredProducts.forEach(product => {
      if (!data[product.category]) {
        data[product.category] = { count: 0, totalPrice: 0 };
      }
      data[product.category].count += 1;
      data[product.category].totalPrice += product.price;
    });

    return Object.entries(data).map(([name, stats]) => ({
      name,
      avgPrice: stats.count > 0 ? Number((stats.totalPrice / stats.count).toFixed(2)) : 0,
      count: stats.count,
    }));
  }, [filteredProducts]);

  return (
    <div className={styles.grid}>
      <div className={`${styles.card} glass`}>
        <h2 className={styles.title}>Average Price by Category</h2>
        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData}>
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                formatter={(val: any) => [`$${val}`, 'Average Price']}
              />
              <Bar dataKey="avgPrice" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={`${styles.card} glass`}>
        <h2 className={styles.title}>Product Count per Category</h2>
        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="count"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
