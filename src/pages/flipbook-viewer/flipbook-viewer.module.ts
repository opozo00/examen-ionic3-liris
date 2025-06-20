import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FlipbookViewerPage } from './flipbook-viewer';

@NgModule({
  declarations: [
    FlipbookViewerPage,
  ],
  imports: [
    IonicPageModule.forChild(FlipbookViewerPage),
  ],
})
export class FlipbookViewerPageModule {}
