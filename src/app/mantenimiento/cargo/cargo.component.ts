import { Component, OnInit } from '@angular/core';
import { Cargo, Empleado } from 'src/app/api/models';
import { CargoControllerService, EmpleadoControllerService } from 'src/app/api/services';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-cargo',
  templateUrl: './cargo.component.html',
  styleUrls: ['./cargo.component.css']
})
export class CargoComponent implements OnInit {

  cargo:Cargo[]=[]
  visible: boolean = false;

  constructor(
    private cargoService: CargoControllerService,
    private messageService: NzMessageService,
    private fb:FormBuilder
  ) { }

  formCargo: FormGroup = this.fb.group({
    id:[],
    nombre:[]
  })

  ngOnInit(): void {
    this.cargoService.find().subscribe(data => this.cargo = data)
  }

  eliminar(id: string): void {
    this.cargoService.deleteById({ id }).subscribe(() => {
      this.cargo = this.cargo.filter(x => x.id !== id);
      this.messageService.success('Registro Eliminado')
    })
  }

  cancel(): void {
    this.messageService.info('Su registro sigue activo!')
  }

  ocultar(): void {
    this.visible = false
    this.formCargo.reset()
  }

  mostrar(data?: Cargo): void {
    if (data?.id) {
      this.formCargo.setValue(data)
    }
    this.visible = true
  }
  guardar(): void {
    this.formCargo.setValue({ ...this.formCargo.value})
    if (this.formCargo.value.id) {
      this.cargoService.updateById({ 'id': this.formCargo.value.id, 'body': this.formCargo.value }).subscribe(
        () => {
          this.cargo = this.cargo.map(obj => {
            if (obj.id === this.formCargo.value.id){
              return this.formCargo.value;
            }
            return obj;
          })
          this.messageService.success('Registro actualizado con exito!')
          this.formCargo.reset()
        }
      )
    } else {
      delete this.formCargo.value.id
      this.cargoService.create({ body: this.formCargo.value }).subscribe((datoAgregado) => {
        this.cargo = [...this.cargo, datoAgregado]
        this.messageService.success('Registro creado con exito!')
        this.formCargo.reset()
      })
    }
    this.visible = false
  }

}
