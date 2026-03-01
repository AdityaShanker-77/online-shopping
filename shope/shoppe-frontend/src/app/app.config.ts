import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { routes } from './app.routes';

import { LucideAngularModule, ShoppingCart, Heart, ShieldCheck, Users, Store, CheckCircle2, Trash2, AlertCircle, ShoppingBag, Plus, Minus, ArrowRight, CreditCard, Truck, ArrowLeftRight, HeartCrack, Tag, ArrowLeft, PackageCheck, PackageX, Search, User, Mail, Phone, MapPin, Shield, Camera, Edit2, Check, X, DollarSign, Package, Edit, UploadCloud, Link, Save, CheckCircle, XCircle, Info } from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom(LucideAngularModule.pick({ ShoppingCart, Heart, ShieldCheck, Users, Store, CheckCircle2, Trash2, AlertCircle, ShoppingBag, Plus, Minus, ArrowRight, CreditCard, Truck, ArrowLeftRight, HeartCrack, Tag, ArrowLeft, PackageCheck, PackageX, Search, User, Mail, Phone, MapPin, Shield, Camera, Edit2, Check, X, DollarSign, Package, Edit, UploadCloud, Link, Save, CheckCircle, XCircle, Info }))
  ]
};
