import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
export default function ClientResources(props) {
  const [params] = useSearchParams();
  const name = params.get("name");
  const id = params.get("id");
  const subId = params.get("subId");

  return <>..............</>;
}
