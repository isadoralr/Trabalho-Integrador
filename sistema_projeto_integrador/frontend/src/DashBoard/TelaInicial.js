import * as React from 'react';
import { extendTheme, /*styled*/ } from '@mui/material/styles';
// import DashboardIcon from '@mui/icons-material/Dashboard';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// import BarChartIcon from '@mui/icons-material/BarChart';
// import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
// import { PageContainer } from '@toolpad/core/PageContainer';
//icons
import AppsIcon from '@mui/icons-material/Apps';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BuildIcon from '@mui/icons-material/Build';
import RequestPageIcon from '@mui/icons-material/RequestPage';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import { Outlet } from 'react-router-dom';

//basicanmente o "kin: ..." é o nome da área que está os "botoes"
const NAVIGATION = [
  {
    kind: 'header',//indica que tipo de elemento vai ser
    title: 'Main items',//nome da area dos "botoes"
  },
  {
    segment: './TelaInicial/Painel',//identificador desse item tipo usar (class)
    title: 'Painel',//nome do icone que mostra na tela
    icon: <AppsIcon />,//icon do "MUI"
  },
  {
    segment: './TelaInicial/Agenda',
    title: 'Agenda',
    icon: <CalendarMonthIcon />,
  },
  {
    segment: './TelaInicial/cadastradoOrcamento',
    title: 'Cadastro de Orcamento',
    icon: <RequestPageIcon />,
  },
  {
    segment: './TelaInicial/Relatorios',
    title: 'Relatorios',
    icon: <ContentPasteSearchIcon />,
  },
  {
    segment: './TelaInicial/CadastroCliente',
    title: 'Clientes',
    icon: <PeopleAltIcon />,
  },
  {
    segment: './TelaInicial/MateriaisFerramentas',
    title: 'Materais e Ferramentas',
    icon: <BuildIcon />,
  },
  {
    segment: './TelaInicial/HistoricoServico',
    title: 'Historico de Servico',
    icon: <LayersIcon />,
  },
];

//extendeTheme e para abrigar varias funcoes de "theme"
//extend para ter o boatao de mudar para light e dark
const demoTheme = extendTheme({
  colorSchemes: { light: true, dark: true },
  colorSchemeSelector: 'class',
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

//funcao para navegar entre os valores da sidebar
//nao entendi direito o MUI coloca isso para manipular os valores da sidebar e navegar entre elas
// function useDemoRouter(initialPath) {
//   const [pathname, setPathname] = React.useState(initialPath);

//   const router = React.useMemo(() => {
//     return {
//       pathname,
//       searchParams: new URLSearchParams(),
//       navigate: (path) => setPathname(String(path)),
//     };
//   }, [pathname]);

//   return router;
// }

//o nome "DashboardLayoutBasic" e um componente de MUI usado para redenrizar uma estrutuar basica de layout de um dashboard
export default function DashboardLayoutBasic(props) {
  const { window } = props;

  // const router = useDemoRouter('/Painel');

  // Remove this const when copying and pasting into your project.
  const demoWindow = window ? window() : undefined;

  return (
    //serve para dar as config globais para o layout do dashboard
    <AppProvider
      navigation={NAVIGATION}
      //titulo e logo do topbar
      branding={{
        logo: <img src="https://mui.com/static/logo.png" alt="MUI logo" />,
        title: 'PlanoMEI',
      }}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout>
      <Outlet/>
      {/* <PageContainer> 
      </PageContainer> */}
      </DashboardLayout>
    </AppProvider>
  );
}