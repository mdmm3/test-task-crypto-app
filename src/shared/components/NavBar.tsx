import { NavLink } from "react-router-dom";
import { Group } from "@mantine/core";

import classes from './NavBar.module.css';

export default function NavBar() {
  return (
    <Group bg="dark">
      <NavLink className={classes.navlink} to="/">Rates</NavLink>
      <NavLink className={classes.navlink} to="/convert">Convert</NavLink>
    </Group>
  );
}