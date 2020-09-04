import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { TurnOrderComponent } from './tools/turn-order/turn-order.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'turn-order',
    pathMatch: 'full',
  },
  {
    path: 'turn-order',
    component: TurnOrderComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
