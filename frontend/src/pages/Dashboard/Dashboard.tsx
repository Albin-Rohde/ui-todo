import React from 'react';

import { useAuth } from '../../hooks/useAuth';

function Dashboard() {
  const { loading } = useAuth({ redirectTo: '/signin' })

  if (loading) {
    return <h1>Loading...</h1>;
  }
  return <h1>Dashboard Page</h1>;
}

export default Dashboard;
