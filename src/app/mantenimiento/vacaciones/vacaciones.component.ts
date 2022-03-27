import { Component, OnInit } from '@angular/core';
import { Vacaciones, Empleado } from 'src/app/api/models';
import { VacacionesControllerService, EmpleadoControllerService } from 'src/app/api/services';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-vacaciones',
  templateUrl: './vacaciones.component.html',
  styleUrls: ['./vacaciones.component.css']
})
export class VacacionesComponent implements OnInit {

  vacaciones:Vacaciones[]=[]
  empleado:Empleado[]=[]
  visible: boolean = false;

  constructor(
    private vacacionesService:VacacionesControllerService,
    private empleadoService:EmpleadoControllerService,
    private messageService: NzMessageService,
    private fb: FormBuilder
  ) { }

  formVacaciones:FormGroup=this.fb.group({
    id:[],
    fecha:[],
    empleadoId:[]
  })

  ngOnInit(): void {
    this.vacacionesService.find().subscribe(data => this.vacaciones = data)
    this.empleadoService.find().subscribe(data => this.empleado = data)
  }

  eliminar(id: string): void {
    this.vacacionesService.deleteById({ id }).subscribe(() => {
      this.vacaciones = this.vacaciones.filter(x => x.id !== id);
      this.messageService.success('Registro Eliminado')
    })
  }

  cancel(): void {
    this.messageService.info('Su registro sigue activo!')
  }

  ocultar(): void {
    this.visible = false
    this.formVacaciones.reset()
  }

  mostrar(data?: Vacaciones): void {
    if (data?.id) {
      this.formVacaciones.setValue({...data})
    }
    this.visible = true
  }
  guardar(): void {
    this.formVacaciones.setValue({ ...this.formVacaciones.value})
    if (this.formVacaciones.value.id) {
      this.vacacionesService.updateById({ 'id': this.formVacaciones.value.id, 'body': this.formVacaciones.value }).subscribe(
        () => {
          this.vacaciones = this.vacaciones.map(obj => {
            if (obj.id === this.formVacaciones.value.id){
              return this.formVacaciones.value;
            }
            return obj;
          })
          this.messageService.success('Registro actualizado con exito!')
          this.formVacaciones.reset()
        }
      )
    } else {
      delete this.formVacaciones.value.id
      this.vacacionesService.create({ body: this.formVacaciones.value }).subscribe((datoAgregado) => {
        this.vacaciones = [...this.vacaciones, datoAgregado]
        this.messageService.success('Registro creado con exito!')
        this.formVacaciones.reset()
      })
    }
    this.visible = false
  }

}
