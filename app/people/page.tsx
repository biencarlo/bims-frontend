import React from "react";
import { IndigenciesDataTable } from "./data-table";
import { columns } from "./columns.tsx";
import { people } from "app/people";

type Props = {};

const People = (props: Props) => {
  return <IndigenciesDataTable columns={columns} data={people} />;
};

export default People;
