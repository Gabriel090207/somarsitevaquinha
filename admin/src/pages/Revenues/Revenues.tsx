import "./Revenues.css";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Sidebar }
  from "../../components/Sidebar/Sidebar";

import {
  Wallet,
  CreditCard,
} from "lucide-react";

import { SiPix }
  from "react-icons/si";

import {
  collection,
  onSnapshot,
} from "firebase/firestore";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { db }
  from "../../services/firebase";

type DonationType = {
  id: string;

  amount: number;

  paymentMethod: string;

  createdAt: any;
};

export function Revenues() {

const [donations, setDonations] =
    useState<DonationType[]>([]);

const [periodFilter, setPeriodFilter] =
  useState("current");

  useEffect(() => {

    const unsubscribe =
      onSnapshot(
        collection(db, "donations"),
        (snapshot) => {

          const list =
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as DonationType[];

          setDonations(list);

        }
      );

    return () => unsubscribe();

  }, []);


  function getDonationDate(
  createdAt: any
) {

  if (!createdAt) {
    return null;
  }

  if (createdAt.seconds) {

    return new Date(
      createdAt.seconds * 1000
    );

  }

  return new Date(createdAt);

}

  function formatCurrency(
    value: number
  ) {

    return value.toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      }
    );

  }

  const monthOptions =
  useMemo(() => {

    const months =
      donations
        .filter((donation) =>
          donation.createdAt
        )
        .map((donation) => {

          const date =
            new Date(
              donation.createdAt.seconds *
              1000
            );

          return {
            value:
              `${date.getFullYear()}-${date.getMonth()}`,
            label:
              date.toLocaleDateString(
                "pt-BR",
                {
                  month: "long",
                  year: "numeric",
                }
              ),
            year:
              date.getFullYear(),
            month:
              date.getMonth(),
          };

        });

    const uniqueMonths =
      months.filter(
        (month, index, self) =>
          index ===
          self.findIndex(
            (item) =>
              item.value === month.value
          )
      );

    return uniqueMonths.sort(
      (a, b) =>
        b.year - a.year ||
        b.month - a.month
    );

  }, [donations]);


  const filteredDonations =
  useMemo(() => {

    const now =
      new Date();

    let selectedYear =
      now.getFullYear();

    let selectedMonth =
      now.getMonth();

    if (
      periodFilter === "previous"
    ) {

      const previousMonth =
        new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          1
        );

      selectedYear =
        previousMonth.getFullYear();

      selectedMonth =
        previousMonth.getMonth();

    }

    if (
      periodFilter !== "current" &&
      periodFilter !== "previous" &&
      periodFilter !== "all"
    ) {

      const [
        year,
        month,
      ] =
        periodFilter
          .split("-")
          .map(Number);

      selectedYear =
        year;

      selectedMonth =
        month;

    }

    if (
      periodFilter === "all"
    ) {

      return donations;

    }

    return donations.filter(
      (donation) => {

        const date =
          getDonationDate(
            donation.createdAt
          );

        if (!date) {
          return false;
        }

        return (
          date.getFullYear() ===
            selectedYear &&
          date.getMonth() ===
            selectedMonth
        );

      }
    );

  }, [donations, periodFilter]);

  const revenueData =
    useMemo(() => {

      const now =
        new Date();

      const year =
        now.getFullYear();

      const month =
        now.getMonth();

      const totalDays =
        new Date(
          year,
          month + 1,
          0
        ).getDate();

      const days =
        Array.from(
          {
            length: totalDays,
          },
          (_, index) => ({
  day: String(index + 1),
  receita: 0,
})
        );

     filteredDonations.forEach(
        (donation) => {

          if (
            !donation.createdAt
          ) {
            return;
          }

          const date =
            new Date(
              donation.createdAt.seconds *
              1000
            );

          if (
            date.getMonth() ===
              month &&
            date.getFullYear() ===
              year
          ) {

            const day =
              date.getDate();

            days[
              day - 1
            ].receita +=
              Number(
                donation.amount || 0
              );

          }

        }
      );

      return days;

   }, [filteredDonations]);

  const stats =
    useMemo(() => {

      let pix = 0;
      let wallet = 0;
      let card = 0;

      filteredDonations.forEach(
        (donation) => {

          const value =
            Number(
              donation.amount || 0
            );

          if (
            donation.paymentMethod ===
            "pix"
          ) {

            pix += value;

          } else if (
            donation.paymentMethod ===
            "wallet"
          ) {

            wallet += value;

          } else {

            card += value;

          }

        }
      );

      return {

        pix,

        wallet,

        card,

        total:
          pix +
          wallet +
          card,

      };

}, [filteredDonations, periodFilter]);

 const chartTitle =
  useMemo(() => {

    const now =
      new Date();

    if (
      periodFilter === "all"
    ) {

      return "Receita de todo período";

    }

    let selectedDate =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      );

    if (
      periodFilter === "previous"
    ) {

      selectedDate =
        new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          1
        );

    }

    if (
      periodFilter !== "current" &&
      periodFilter !== "previous"
    ) {

      const [
        year,
        month,
      ] =
        periodFilter
          .split("-")
          .map(Number);

      selectedDate =
        new Date(
          year,
          month,
          1
        );

    }

    return `Receita de ${selectedDate
      .toLocaleDateString(
        "pt-BR",
        {
          month: "long",
          year: "numeric",
        }
      )}`;

  }, [periodFilter]);

  return (

    <main className="revenues-page">

      <Sidebar />

      <section className="revenues-content">

       <div className="revenues-header">

  <div>

    <span>
      Financeiro
    </span>

    <h1>
      Receitas
    </h1>

  </div>

<select
  className="revenues-filter"
  value={periodFilter}
  onChange={(event) =>
    setPeriodFilter(
      event.target.value
    )
  }
>

  <option value="current">
    Mês atual
  </option>

  <option value="previous">
    Mês anterior
  </option>

  <option value="all">
    Tempo todo
  </option>

  {monthOptions.map((month) => (

    <option
      key={month.value}
      value={month.value}
    >
      {month.label}
    </option>

  ))}

</select>

</div>

        <div className="revenues-cards">

          <div className="revenue-card">

  <div className="revenue-card-top">

    <div className="revenue-icon pix">

      <SiPix size={20} />

    </div>

    <span>
      PIX
    </span>

  </div>

  <strong>
              {
                formatCurrency(
                  stats.pix
                )
              }
            </strong>

          </div>

         <div className="revenue-card">

  <div className="revenue-card-top">

    <div className="revenue-icon wallet">

      <Wallet size={20} />

    </div>

    <span>
      Carteira
    </span>

  </div>

  <strong>
    {
      formatCurrency(
        stats.wallet
      )
    }
  </strong>

</div>

        <div className="revenue-card">

  <div className="revenue-card-top">

    <div className="revenue-icon card">

      <CreditCard size={20} />

    </div>

    <span>
      Cartão
    </span>

  </div>

  <strong>
    {
      formatCurrency(
        stats.card
      )
    }
  </strong>

</div>

         <div className="revenue-card total revenue-total-card">

            <span>
              Receita Total
            </span>

            <strong>
              {
                formatCurrency(
                  stats.total
                )
              }
            </strong>

          </div>

        </div>

        <div className="revenue-chart-card">

          <div className="revenue-chart-header">

           <h2>
 {chartTitle}
</h2>

          </div>

          <div className="revenue-chart">

            <ResponsiveContainer
              width="100%"
              height={420}
            >

              <AreaChart
                data={
                  revenueData
                }
              >

                <CartesianGrid
  vertical={false}
  strokeDasharray="4 4"
  stroke="#E5E7EB"
/>
               <XAxis
  dataKey="day"
  tickLine={false}
  axisLine={false}
/>

<YAxis
  tickLine={false}
  axisLine={false}
  tickFormatter={(value) =>
    `R$ ${value}`
  }
/>

                <Tooltip
                 formatter={(value: any) => [
  formatCurrency(
    Number(value)
  ),
  "Receita"
]}
                />

                <>
  <defs>

    <linearGradient
      id="receitaGradient"
      x1="0"
      y1="0"
      x2="0"
      y2="1"
    >

      <stop
        offset="0%"
        stopColor="#7ED321"
        stopOpacity={0.35}
      />

      <stop
        offset="100%"
        stopColor="#7ED321"
        stopOpacity={0}
      />

    </linearGradient>

  </defs>

  <Area
    type="monotone"
    dataKey="receita"
    stroke="#7ED321"
    fill="url(#receitaGradient)"
    strokeWidth={4}
  />
</>

              </AreaChart>

            </ResponsiveContainer>

          </div>

        </div>

      </section>

    </main>

  );

}