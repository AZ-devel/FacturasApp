import { Component, OnInit } from '@angular/core';
import { Logs } from '../../Models/Entities.model';
import { SFacturasService } from '../../services/sfacturas.service';
import { error } from 'console';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.css'
})
export class LogsComponent implements OnInit{
  p:number=1
  listaLogs:Logs[]=[]
  
  constructor(private sFacturas:SFacturasService){}

  ngOnInit(): void {
    this.sFacturas.listarLogs().subscribe(
      respuesta=>{
        if (respuesta.esCorrecto) {
          this.listaLogs=Object.values(respuesta.valor)
        }else{
          console.log(respuesta.mensaje)
        }
      },
      error=>{
        console.log(error)
      }
    )
  }
}
