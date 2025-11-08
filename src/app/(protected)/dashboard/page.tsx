import { auth } from "@clerk/nextjs/server";
import React from "react";

const Dashboard = async () => {
  const { userId } = await auth();

  return (
    <div>
      Dashboard Page
      {userId ? ` - User ID: ${userId}` : " - Not Signed In"}
    </div>
  );
};

export default Dashboard;
