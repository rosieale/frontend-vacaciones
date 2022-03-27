import { Component, OnInit } from '@angular/core';
import { CodigoTrabajo } from 'src/app/api/models';
import { CodigoTrabajoControllerService } from 'src/app/api/services';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-codigo-trabajo',
  templateUrl: './codigo-trabajo.component.html',
  styleUrls: ['./codigo-trabajo.component.css']
})
export class CodigoTrabajoComponent implements OnInit {

  codigoTrabajo:CodigoTrabajo[]=[]
  visible: boolean = false;

  constructor(
    private codigoTrabajoService: CodigoTrabajoControllerService,
    private messageService: NzMessageService,
    private fb: FormBuilder) { }

    formCodigoTrabajo: FormGroup = this.fb.group({
      id: [],
      antiguedad: new FormControl(),
      diasOtorgados: new FormControl(),
      vigente: []
    })

  ngOnInit(): void {
    this.codigoTrabajoService.find().subscribe(data => this.codigoTrabajo = data)
  }

  eliminar(id: string): void {
    this.codigoTrabajoService.deleteById({ id }).subscribe(() => {
      this.codigoTrabajo = this.codigoTrabajo.filter(x => x.id !== id);
      this.messageService.success('Registro Eliminado')
    })
  }

  cancel(): void {
    this.messageService.info('Su registro sigue activo!')
  }

  ocultar(): void {
    this.visible = false
    this.formCodigoTrabajo.reset()
  }

  mostrar(data?: CodigoTrabajo): void {
    if (data?.id) {
      this.formCodigoTrabajo.setValue({ ...data, 'vigente': String(data.vigente) })
    }
    this.visible = true
  }
  guardar(): void {
    this.formCodigoTrabajo.setValue({ ...this.formCodigoTrabajo.value, 'vigente': Boolean(this.formCodigoTrabajo.value.vigente) })
    if (this.formCodigoTrabajo.value.id) {
      this.codigoTrabajoService.updateById({ 'id': this.formCodigoTrabajo.value.id, 'body': this.formCodigoTrabajo.value }).subscribe(
        () => {
          this.codigoTrabajo = this.codigoTrabajo.map(obj => {
            if (obj.id === this.formCodigoTrabajo.value.id){
              return this.formCodigoTrabajo.value;
            }
            return obj;
          })
          this.messageService.success('Registro actualizado con exito!')
          this.formCodigoTrabajo.reset()
        }
      )
    } else {
      delete this.formCodigoTrabajo.value.id
      this.codigoTrabajoService.create({ body: this.formCodigoTrabajo.value }).subscribe((datoAgregado) => {
        this.codigoTrabajo = [...this.codigoTrabajo, datoAgregado]
        this.messageService.success('Registro creado con exito!')
        this.formCodigoTrabajo.reset()
      })
    }
    this.visible = false
  }

}
