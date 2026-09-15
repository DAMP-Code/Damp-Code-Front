import BackButton from "@/app-components/BackButton";
import PrizeChart from "@/app-components/charts/PrizeChart";
import StatusChart from "@/app-components/charts/StatusChart";
import TechnologyChart from "@/app-components/charts/TechnologyChart";
import Title from "@/app-components/Title";
import React, { useEffect, useState } from "react";

const Ranking = () => {

  const [hackathons, setHackathons] = useState([]);

  useEffect(() => {

    async function loadHackathons() {

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      const response = await fetch(
        "https://localhost:7092/api/Hackathons"
      );

      const data = await response.json();

      const companyHackathons = data.filter(
        h =>
          h.empresa?.toLowerCase() ===
          user.name?.toLowerCase()
      );

      setHackathons(companyHackathons);
    }

    loadHackathons();

  }, []);

  return (
    <div className="min-h-screen bg-surface px-4 py-8 sm:px-6 lg:p-10">

      <div className="mx-auto mb-10 flex max-w-7xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <Title text1={"Dashboard"} text2={"Da empresa"}></Title>
        <BackButton />
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">

        <div className="rounded-2xl border border-white/10 bg-surface-light p-5 shadow-xl">
          <StatusChart hackathons={hackathons} />
        </div>

        <div className="rounded-2xl border border-white/10 bg-surface-light p-5 shadow-xl lg:col-span-2">
          <PrizeChart hackathons={hackathons} />
        </div>

      </div>

      <div className="mx-auto mt-6 max-w-7xl rounded-2xl border border-white/10 bg-surface-light p-5 shadow-xl">
        <TechnologyChart hackathons={hackathons} />
      </div>

    </div>
  );
};

export default Ranking;
