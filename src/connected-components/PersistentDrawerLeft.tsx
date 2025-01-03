'use client';
import { usePathname, useRouter } from 'next/navigation';

import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { styled, useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import { Fade, IconButton, LinearProgress, Menu, MenuItem, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { appActions } from '@/redux/slices/app-slice';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useGlobalLoading } from '@Hooks/useGlobalLoading';
import { AlertProvider } from '@Components/Alert';

const getRouteMatch = (pathToMatch: string, routes: LeftNavRoute[]) => {
  const sortedRoutes = routes.sort((a, b) => b.route.length - a.route.length);

  for (const r of sortedRoutes) {
    if (pathToMatch.includes(r.route)) {
      return r;
    }
  }
  return undefined;
};

const shouldHighlightNavItem = (currentPath: string, navPath: string) => {
  return currentPath === navPath;
};

const getRouteLabel = (pathToMatch: string, routes: LeftNavRoute[]) => {
  const route = getRouteMatch(pathToMatch, routes);
  return route ? (routes.find((r) => r === route)?.text ?? '') : '';
};

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  backgroundColor: theme.palette.grey[200],
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  variants: [
    {
      props: ({ open }) => open,
      style: {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
      },
    },
  ],
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

/**
 * DrawerHeader component to render the header of the drawer.
 */
const DrawerHeader = ({ children }: React.PropsWithChildren) => {
  const theme = useTheme();
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0.5, 1),
        minHeight: theme.mixins.toolbar.minHeight,
        justifyContent: 'flex-end',
      }}
    >
      {children}
    </div>
  );
};

interface LeftNavRoute {
  text: string;
  icon: React.ReactElement;
  route: string;
}

const getAdminNavSection = (): LeftNavRoute[] => {
  const items: LeftNavRoute[] = [];

  items.push({ text: 'Products', icon: <WaterDropIcon />, route: `/products` });

  return items;
};

interface NavDrawerProps {
  drawerOpen: boolean;
  handleDrawerClose: () => void;
  handleRoutePush: (route: string) => () => void;
}

/**
 * NavDrawer component renders a persistent drawer on the left side of the screen.
 * The drawer displays different navigation sections based on the user's roles.
 */
const NavDrawer = ({ drawerOpen, handleDrawerClose, handleRoutePush }: NavDrawerProps) => {
  const theme = useTheme();
  const pathname = usePathname();

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      variant="persistent"
      anchor="left"
      open={drawerOpen}
    >
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'ltr' ? (
            <ChevronLeftIcon data-testid="chevron-left" />
          ) : (
            <ChevronRightIcon data-testid="chevron-right" />
          )}
        </IconButton>
      </DrawerHeader>
      <Box sx={{ height: '8px' }} />

      <>
        <Divider />
        <List>
          {getAdminNavSection().map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={handleRoutePush(item.route)}
                selected={shouldHighlightNavItem(pathname, item.route)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </>
    </Drawer>
  );
};

interface HeaderToolbarProps {
  anchorEl: HTMLElement | null;
  handleMenu: (event: React.MouseEvent<HTMLElement>) => void;
  handleClose: () => void;
  getUserMenuItems: () => React.ReactNode[];
  drawerOpen: boolean;
  handleDrawerOpen: () => void;
}

/**
 * HeaderToolbar component renders a toolbar with a menu button, title, and user account menu.
 */
const HeaderToolbar = ({
  anchorEl,
  handleMenu,
  handleClose,
  getUserMenuItems,
  drawerOpen,
  handleDrawerOpen,
}: HeaderToolbarProps) => {
  const pathName = usePathname();

  const allRoutes = useMemo(() => [...getAdminNavSection()], []);

  const routeLabel = useMemo(() => getRouteLabel(pathName, allRoutes), [allRoutes, pathName]);

  return (
    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Box display="flex" alignItems="center">
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={[
            {
              mr: 2,
            },
            drawerOpen && { display: 'none' },
          ]}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          {/*   // TODO FIX ME */}
          Default
          {routeLabel.length > 0 && ` | ${getRouteLabel(pathName, allRoutes)}`}
        </Typography>
      </Box>
      <Box>
        <IconButton
          size="large"
          data-testid="account-menu-anchor"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {getUserMenuItems()}
        </Menu>
      </Box>
    </Toolbar>
  );
};

/**
 * PersistentDrawerLeft component provides a layout with a persistent drawer on the left side.
 * It includes an AppBar with a header toolbar and a navigation drawer.
 * The drawer can be opened and closed, and it displays user-specific menu items if the user is logged in.
 */
export function PersistentDrawerLeft({ children }: React.PropsWithChildren) {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const user = useSelector((state: RootState) => state.app.user);
  const drawerOpen = useSelector((state: RootState) => state.app.drawerOpen);
  const globalLoading = useGlobalLoading();
  const dispatch = useDispatch();

  const [showLoader, setShowLoader] = useState(false);
  const delayTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Set up the delayed loader logic
  useEffect(() => {
    if (globalLoading) {
      // Start the .1-second timer when loading starts
      delayTimer.current = setTimeout(() => {
        setShowLoader(true); // Show the loader after .1 second
      }, 100);
    } else {
      // Clear the loader state and timer when loading stops
      setShowLoader(false);
      if (delayTimer.current) {
        clearTimeout(delayTimer.current);
        delayTimer.current = null;
      }
    }
    // Cleanup timeout on unmount
    return () => {
      if (delayTimer.current) {
        clearTimeout(delayTimer.current);
      }
    };
  }, [globalLoading]);

  const handleDrawerOpen = useCallback(() => {
    dispatch(appActions.setDrawerOpen(true));
  }, [dispatch]);

  const handleDrawerClose = useCallback(() => {
    dispatch(appActions.setDrawerOpen(false));
  }, [dispatch]);

  const handleMenu = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const logout = useCallback(() => {
    // TODO FIX ME
    dispatch(appActions.clearUser());
    router.push('/');
  }, [dispatch, router]);

  const getUserMenuItems = useCallback(() => {
    const items: React.ReactNode[] = [];
    if (user) {
      items.push(
        <MenuItem onClick={logout} key="logout">
          Logout
        </MenuItem>,
      );
    }

    return items;
  }, [logout, user]);

  const handleRoutePush = useCallback(
    (route: string) => () => {
      router.push(route);
    },
    [router],
  );

  return (
    <AlertProvider>
      <Box sx={{ display: 'flex' }}>
        <AppBar position="fixed" open={drawerOpen}>
          <HeaderToolbar
            anchorEl={anchorEl}
            handleMenu={handleMenu}
            handleClose={handleClose}
            getUserMenuItems={getUserMenuItems}
            drawerOpen={drawerOpen}
            handleDrawerOpen={handleDrawerOpen}
          />
          <Fade in={showLoader} unmountOnExit>
            <LinearProgress sx={{ width: '100%' }} color="success" />
          </Fade>
        </AppBar>

        <NavDrawer drawerOpen={drawerOpen} handleDrawerClose={handleDrawerClose} handleRoutePush={handleRoutePush} />
        <Main open={drawerOpen}>
          <DrawerHeader />
          {children}
        </Main>
      </Box>
    </AlertProvider>
  );
}
