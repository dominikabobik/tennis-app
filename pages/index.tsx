import React, { PureComponent, useCallback, useEffect, useState } from 'react';
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer, Cell, Sector } from 'recharts';
import styles from "./index.module.css"
import { CountryStats, stats_per_country } from '@/lib/lib';
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { setServers } from 'dns';
import { ActiveShape } from '@/components/ActiveShape';


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042',
  '#f72585', '#b5179e', '#7209b7', '#560bad', '#480ca8',
  '#3a0ca3', '#3f37c9', '#4361ee', '#4895ef', '#4cc9f0'
];

export const getServerSideProps: GetServerSideProps<{
  stats: CountryStats[]
}> = async () => {
  const stats = await stats_per_country("100");
  console.log(stats)
  return { props: { stats } }
}

export default function Home({
  stats,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {

  const [data, setData] = useState(stats)
  const [activeIndex, setActiveIndex] = useState(0);
  const [range, setRange] = useState('100')

  const onPieEnter = useCallback(
    (_: any, index: React.SetStateAction<number>) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

  const onRangeChange = useCallback((e: any) => {
    setRange(e.target.value)
  }, [range])

  const onButtonClick = useCallback(() => {
    fetch("/api/stats?range=" + range).then((res) => {
      return res.json()
    }).then((newData) => {
      console.log(newData)
      setData(newData)
    })
  }, [range])

  return (
    <div className={styles.wrapper}>
      <div className={styles.header1}>
        Top {range} ATP players by country
      </div>
      <div className={styles.header2}>
        Pick custom range and press search
      </div>
      <div className={styles.rangeWrapper}>
        <input type='number' value={range} onChange={onRangeChange} className={styles.rangeInput} />
        <button onClick={onButtonClick} className={styles.searchButton}>
          search
        </button>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={400} height={400}>
          <Pie
            nameKey="country"
            dataKey="number"
            isAnimationActive={false}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={160}
            outerRadius={220}
            paddingAngle={2}
            fill="#8884d8"
            activeIndex={activeIndex}
            onMouseEnter={onPieEnter}
            activeShape={ActiveShape}
            onClick={() => { }}
            style={{ padding: '20px' }}
          >
            {stats.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}

          </Pie>
          <Legend align="left" verticalAlign="middle" width={200} iconType='circle' />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
