import { SetMetadata } from '@nestjs/common';

export const ADMIN_ROUTE_KEY = 'ADMIN_ROUTE';

export const AdminRoute = () => SetMetadata(ADMIN_ROUTE_KEY, true);
