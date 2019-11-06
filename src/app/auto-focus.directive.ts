
import { Directive, ElementRef, Input, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[datoAutoFocus]'
})
export class AutoFocusDirective {

  @Input()
  public set datoAutoFocus(value) {
    if (!!value) {
      this.host.nativeElement.focus();
    }
  }

  public constructor(
    private host: ElementRef,
  ) {
  }


}