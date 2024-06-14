import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { navbarData } from './nav-data';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css',
  //Agregaremos animaciones - arreglar
  animations: [
    // trigger('fadeInOut',[
    //   transition(':enter', [
    //     style({opacity: 0}),
    //     animate('350ms',
    //       style({opacity: 1})
    //     )
    //   ]),
    //   transition(':leave', [
    //     style({opacity: 1}),
    //     animate('350ms',
    //       style({opacity: 0})
    //     )
    //   ])
    // ]),
    //Esto hara que gire el boton de cerrar
    trigger('rotate',[
      transition(':enter',
        animate('1000ms',
          keyframes([
            style({transform: 'rotate(0deg)', offset: '0'}),
            style({transform: 'rotate(2turn)', offset: '1'})
          ])
        )
      )
    ])
  ]
})
export class SidenavComponent implements OnInit{

  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  // cambiar entre true y false para mostrar opcionesdel sidenav
  collapsed = false;
  screenWidth = 0;
  navData = navbarData;

  //esto espor si la pantalla cambia de tamaño se escondera la sidenav
  @HostListener('window:resize', ['$event'])
  onResize(event: any){
    this.screenWidth = window.innerWidth;
    if(this.screenWidth <= 768){
      this.collapsed = false;
      this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth})
    }
  }

  ngOnInit(): void {
      this.screenWidth = window.innerWidth;
  }

  toggleColapse(): void{
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth})
  }

  closeSidenav(): void{
    this.collapsed = false;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth})
  }
}
