/* Copyright (c) 2018-2023 VMware, Inc. All rights reserved. */

import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GlobalService } from '~services/global.service';
import { Router } from '@angular/router';
import { ResourceService } from '~services/resource.service';
import { MessagingService } from '~services/messaging.service';

@Component({
   selector: 'app-root',
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
   private initialThemeLoadComplete: boolean = false;
   private messagingServiceInitialized: boolean = false;

   public get initialized(): boolean {
      return this.globalService.htmlClientSdk.isInitialized() &&
            this.initialThemeLoadComplete &&
            this.messagingServiceInitialized;
   }

   constructor(private translate: TranslateService,
               private globalService: GlobalService,
               private messagingService: MessagingService,
               private router: Router,
               private resourceService: ResourceService) {
   }

   ngOnInit(): void {
      this.translate.onLangChange.subscribe(() => {
         this.resourceService.loadStrings();
      });
      this.translate.addLangs(['en-US', 'de-DE', 'fr-FR']);
      this.translate.setDefaultLang('en-US');
      this.globalService.htmlClientSdk.initialize(() => {
         this.messagingService.init$().subscribe({
            error: () => {
               this.messagingServiceInitialized = true;
            },
            complete: () => {
               this.messagingServiceInitialized = true;
            }
         });

         const navData = this.globalService.htmlClientSdk.app.getNavigationData();
         if (navData && navData.navigationPath && navData.selectedChassis) {
            this.router.navigateByUrl(navData.navigationPath, {
               state: {selectedChassis: navData.selectedChassis},
               replaceUrl: true
            });
         }
         const locale = this.globalService.htmlClientSdk.app.getClientLocale();
         if (locale && this.translate.getLangs().indexOf(locale) > 0) {
            this.translate.use(locale);
         } else {
            this.translate.use(this.translate.getDefaultLang());
         }

         if (this.globalService.htmlClientSdk.app.getTheme &&
               this.globalService.htmlClientSdk.event.onThemeChanged) {
            this.loadTheme(true, this.globalService.htmlClientSdk.app.getTheme());
            this.globalService.htmlClientSdk.event.onThemeChanged(
                  this.loadTheme.bind(this, false)
            );
         } else {
            this.loadTheme(true, {name: 'light'});
         }
      });
   }

   private loadTheme(firstLoad: boolean, theme: any): void {
      let themeName: string = theme.name;
      const supportedThemeNames: string[] = ['light', 'dark'];
      if (supportedThemeNames.indexOf(themeName) === -1) {
         themeName = supportedThemeNames[0];
      }

      const styleSheetLinkElement =
            document.getElementById('theme-stylesheet-link') as HTMLLinkElement;
      const themeCssUrl = `theme-${themeName}.css`;

      if (firstLoad) {
         const initialThemeLoadCompleteListener = (event: Event) => {
            this.initialThemeLoadComplete = true;
            styleSheetLinkElement.removeEventListener('load', initialThemeLoadCompleteListener);
            styleSheetLinkElement.removeEventListener('error', initialThemeLoadCompleteListener);
         };

         styleSheetLinkElement.addEventListener('load', initialThemeLoadCompleteListener);
         styleSheetLinkElement.addEventListener('error', initialThemeLoadCompleteListener);
      }
      styleSheetLinkElement.setAttribute('href', themeCssUrl);

      document.documentElement.setAttribute('data-theme', themeName);
   }
}
