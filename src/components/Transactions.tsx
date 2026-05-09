import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { format } from "date-fns";

interface Transaction {
  _id: string;
  userID: string;
  amount: number;
  description: string;
  date: string;
}

export default function Transactions({
  transactions,
  loading,
  error,
}: {
  transactions: Transaction[];
  loading: boolean;
  error: string;
}): React.JSX.Element {
  if (loading)
    return (
      <div>
        <>Loading...</>
      </div>
    );
  if (error)
    return (
      <div>
        <>Error: {error}</>
      </div>
    );

  return (
    <div>
      {transactions.map((trans) => (
        <div>{format(trans.date, "")}</div>
      ))}
    </div>
  );
}
