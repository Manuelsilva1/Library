import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    displayName: 'Inicio',
    iconName: 'home', // o cualquier otro icono apropiado de Tabler Icons
    route: '/',
  },
  {
    displayName: 'Catálogo',
    iconName: 'book', // o cualquier otro icono apropiado
    route: '/catalogo',
  },
  {
    displayName: 'Ofertas',
    iconName: 'discount-2', // o cualquier otro icono apropiado
    route: '/ofertas',
  },
  {
    displayName: 'Autores',
    iconName: 'users', // o cualquier otro icono apropiado
    route: '/autores',
  },
  {
    displayName: 'Contacto',
    iconName: 'phone', // o cualquier otro icono apropiado
    route: '/contacto',
  },
];
