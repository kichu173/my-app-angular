import { Directive, OnInit, Renderer2, HostListener, ElementRef, HostBinding } from "@angular/core";

@Directive({
    selector: '[appDropdown]'
})
export class DropdownDirective {
    @HostBinding('class.open') isOpen = false;
    
    @HostListener('click') toggleOpen(event: Event) {
        this.isOpen = !this.isOpen;
    }

}