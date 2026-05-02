'use client';

import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  BarChart, Bar
} from 'recharts';
import { DashboardStats } from '../../types/product';
import styles from './Analytics.module.css';

interface AnalyticsProps {
  stats: DashboardStats;
}

const COLORS = ['#7c3aed', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];

export const Analytics: React.FC<AnalyticsProps> = ({ stats }) => {
  return (
    <div className={styles.container}>
      <div className={`${styles.card} glass glass-hover`}>
        <div className={styles.cardHeader}>
          <h3>Market Analysis</h3>
          <span className={styles.subtitle}>Average Price Trend</span>
        </div>
        <div className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={stats.averagePricePerCategory}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-cyan)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--accent-cyan)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
              <XAxis 
                dataKey="category" 
                stroke="var(--text-muted)" 
                fontSize={10}
                tickLine={false}
                axisLine={false}
                dy={10}
                minTickGap={20}
                tickFormatter={(val: string) => val.length > 10 ? val.substring(0, 8) + '..' : val}
              />
              <YAxis 
                stroke="var(--text-muted)" 
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val: number) => `$${val}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 15, 20, 0.95)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(8px)'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="var(--accent-cyan)" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorValue)" 
                dot={{ r: 4, fill: 'var(--accent-cyan)', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, fill: 'var(--accent-cyan)', stroke: '#fff', strokeWidth: 2, className: 'glow-cyan' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={`${styles.card} glass glass-hover`}>
        <div className={styles.cardHeader}>
          <h3>Distribution</h3>
          <span className={styles.subtitle}>Inventory by Category</span>
        </div>
        <div className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.productCountPerCategory}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={95}
                paddingAngle={8}
                dataKey="value"
                nameKey="category"
                stroke="none"
              >
                {stats.productCountPerCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                 contentStyle={{ 
                  backgroundColor: 'rgba(15, 15, 20, 0.95)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(8px)'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={`${styles.card} glass glass-hover`}>
        <div className={styles.cardHeader}>
          <h3>Performance</h3>
          <span className={styles.subtitle}>Average Rating by Category</span>
        </div>
        <div className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.averageRatingPerCategory}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
              <XAxis 
                dataKey="category" 
                stroke="var(--text-muted)" 
                fontSize={10}
                tickLine={false}
                axisLine={false}
                dy={10}
                minTickGap={20}
                tickFormatter={(val: string) => val.length > 10 ? val.substring(0, 8) + '..' : val}
              />
              <YAxis 
                stroke="var(--text-muted)" 
                fontSize={11}
                tickLine={false}
                axisLine={false}
                domain={[0, 5]}
                ticks={[0, 1, 2, 3, 4, 5]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 15, 20, 0.95)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(8px)'
                }}
                cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
              />
              <Bar 
                dataKey="value" 
                fill="var(--success)" 
                radius={[4, 4, 0, 0]} 
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={`${styles.card} glass glass-hover`}>
        <div className={styles.cardHeader}>
          <h3>Stock Health</h3>
          <span className={styles.subtitle}>Total Units per Category</span>
        </div>
        <div className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.totalStockPerCategory}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
              <XAxis 
                dataKey="category" 
                stroke="var(--text-muted)" 
                fontSize={10}
                tickLine={false}
                axisLine={false}
                dy={10}
                minTickGap={20}
                tickFormatter={(val: string) => val.length > 10 ? val.substring(0, 8) + '..' : val}
              />
              <YAxis 
                stroke="var(--text-muted)" 
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 15, 20, 0.95)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(8px)'
                }}
                cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
              />
              <Bar 
                dataKey="value" 
                fill="#ec4899" 
                radius={[4, 4, 0, 0]} 
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
