import { ROUTER } from "@/prefix/router";

export interface INavMenu {
  label: string;
  icon?: JSX.Element;
  submenu?: INavMenu[];
  path?: string;
}

export const NAVMENU: INavMenu[] = [
  {
    label: "PIUTANG",
    submenu: [
      { label: "Laporan", path: ROUTER.PIUTANG.LAPORAN },
      {
        label: "Laporan dua",
        submenu: [{ label: "Laporan", path: ROUTER.PIUTANG.LAPORAN }],
      },
    ],
  },
  {
    label: "HUTANG",
    submenu: [{ label: "Laporan", path: ROUTER.HUTANG.LAPORAN }],
  },
  {
    label: "LABA",
    path: ROUTER.LABA,
    // submenu: [{ label: "Laporan", path: ROUTER.HUTANG.LAPORAN }],
  },
];
