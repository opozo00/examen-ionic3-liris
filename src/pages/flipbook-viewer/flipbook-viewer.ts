import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@IonicPage()
@Component({
  selector: 'page-flipbook-viewer',
  templateUrl: 'flipbook-viewer.html',
})
export class FlipbookViewerPage {
  flipbookUrl: SafeResourceUrl;

  constructor(public navCtrl: NavController, public navParams: NavParams, private sanitizer: DomSanitizer) {
    const rawUrl = this.navParams.get('url');
    this.flipbookUrl = this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FlipbookViewerPage');
  }

}

// import { Component, AfterViewInit } from '@angular/core'
// import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

// declare var $: any;

// @IonicPage()
// @Component({
//   selector: 'page-flipbook-viewer',
//   templateUrl: 'flipbook-viewer.html'
// })
// export class FlipbookViewerPage implements AfterViewInit {

//   constructor(private platform: Platform) { }

//   ngAfterViewInit() {
//     this.platform.ready().then(() => {
//       // Wait a bit to ensure DOM is ready
//       setTimeout(() => {
//         $('#flipbook-container').FlipBook({
//           pdf: 'assets/flipbook/REGLAMENTO INTERNO.pdf',
//           controlsProps: {
//             downloadURL: 'assets/flipbook/REGLAMENTO INTERNO.pdf',
//             actions: {
//               cmdBackward: { code: 37, enabled: true },
//               cmdForward: { code: 39, enabled: true }
//             }
//           },
//           template: {
//             html: 'assets/flipbook/templates/default-book-view.html',
//             styles: ['assets/flipbook/css/3dflipbook.style.css'],
//             script: 'assets/flipbook/js/default-book-view.js'
//           }
//         });
//       }, 300);
//     });
//   }
// }

