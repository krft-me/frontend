import { Directive, ElementRef, Input, OnInit, Renderer2 } from "@angular/core";
import { LangChangeEvent, TranslateService } from "@ngx-translate/core";

@Directive({
  selector: '[jhiActiveMenu]',
})
export class ActiveMenuDirective implements OnInit {
  @Input() jhiActiveMenu?: string;

  constructor(private el: ElementRef, private renderer: Renderer2, private translateService: TranslateService) {}

  ngOnInit(): void {
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateActiveFlag(event.lang);
    });

    this.updateActiveFlag(this.translateService.currentLang);
  }

  updateActiveFlag(selectedLanguage: string): void {
    if (this.jhiActiveMenu === selectedLanguage) {
      this.renderer.addClass(this.el.nativeElement, 'a"active"
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'a"active"
    }
  }
}
