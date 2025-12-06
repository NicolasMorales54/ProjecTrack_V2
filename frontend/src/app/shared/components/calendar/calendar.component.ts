import { Component, Input, OnInit, OnChanges, ViewEncapsulation, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ScheduleModule, EventSettingsModel, View, DayService, WeekService, MonthService, ScheduleComponent } from '@syncfusion/ej2-angular-schedule';

interface CalendarTask {
  id: number;
  nombre: string;
  descripcion?: string;
  fechaInicio: string | Date;
  fechaVencimiento: string | Date;
  estado: string;
  prioridad: string;
  projectId: number;
  projectName: string;
}

interface ScheduleEvent {
  Id: number;
  Subject: string;
  StartTime: Date;
  EndTime: Date;
  Description?: string;
  IsAllDay: boolean;
  CategoryColor?: string;
  ProjectId: number;
  ProjectName: string;
  Estado: string;
  Prioridad: string;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, ScheduleModule],
  providers: [DayService, WeekService, MonthService],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  encapsulation: ViewEncapsulation.None // Necesario para estilos de Syncfusion
})
export class CalendarComponent implements OnInit, OnChanges {
  @Input() tasks: CalendarTask[] = [];
  @Input() userRole: string = 'admin';

  @ViewChild('scheduleObj') scheduleObj?: ScheduleComponent;

  public eventSettings: EventSettingsModel = {
    dataSource: []
  };

  public selectedDate: Date = new Date();
  public views: View[] = ['Day', 'Week', 'Month'];
  public currentView: View = 'Month';

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  ngOnChanges(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    const events: ScheduleEvent[] = this.tasks.map(task => {
      const startTime = new Date(task.fechaInicio);
      const endTime = new Date(task.fechaVencimiento);

      // Si no hay hora específica, marcar como todo el día
      const isAllDay = this.isSameDate(startTime, endTime);

      return {
        Id: task.id,
        Subject: task.nombre,
        StartTime: startTime,
        EndTime: endTime,
        Description: task.descripcion || '',
        IsAllDay: isAllDay,
        CategoryColor: this.getPriorityColor(task.prioridad),
        ProjectId: task.projectId,
        ProjectName: task.projectName,
        Estado: task.estado,
        Prioridad: task.prioridad
      };
    });

    this.eventSettings = {
      dataSource: events,
      fields: {
        id: 'Id',
        subject: { name: 'Subject' },
        startTime: { name: 'StartTime' },
        endTime: { name: 'EndTime' },
        description: { name: 'Description' },
        isAllDay: { name: 'IsAllDay' }
      }
    };

    // Pequeño delay para asegurar que Syncfusion se inicialice correctamente
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 100);
  }

  isSameDate(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'Alta':
        return '#ef4444'; // red-500
      case 'Media':
        return '#f59e0b'; // yellow-500
      case 'Baja':
        return '#10b981'; // green-500
      default:
        return '#6b7280'; // gray-500
    }
  }

  onEventClick(args: any): void {
    const event = args.event as ScheduleEvent;
    const route = `/${this.userRole}/project/${event.ProjectId}/task-detail/${event.Id}`;
    this.router.navigate([route]);
  }

  onPopupOpen(args: any): void {
    // Deshabilitar la edición de eventos (solo lectura)
    if (args.type === 'Editor') {
      args.cancel = true;
    }
  }

  goToToday(): void {
    const today = new Date();
    this.selectedDate = today;

    // Usar el método nativo de Syncfusion para navegar
    if (this.scheduleObj) {
      this.scheduleObj.selectedDate = today;
      this.scheduleObj.dataBind();
    }

    this.cdr.detectChanges();
  }
}
