import * as React from 'react';
import { Calendar, DatePicker, defaultDatePickerStrings, ICalendarDayProps, IDatePickerStrings, mergeStyleSets } from '@fluentui/react';

export interface IHelloWorldProps {
  minDate: Date;
  maxDate: Date;
  selectedDate?: Date;
  onSelectDate: (newValue: Date | null | undefined) => void;
  uniqueKey:string;
  allowTextInput : boolean;
  showMonthPickerAsOverlay  : boolean;
  showWeekNumbers  : boolean;
  isRequired  : boolean;
  disableDays:number[];
  restrictedDates:Date[];
  isDisable:boolean;
}

interface IHelloWorldState {
  minDate: Date;
  maxDate: Date;
  currentSelectedDate?:Date | null | undefined;
  normalizedRestrictedDates: string[] ;
}

export class HelloWorld extends React.Component<IHelloWorldProps,IHelloWorldState> {

  constructor(props: IHelloWorldProps) {
    super(props);
    this.state = {
      minDate: props.minDate,
      maxDate : props.maxDate,
      currentSelectedDate : props.selectedDate,
      normalizedRestrictedDates: this.props.restrictedDates.map(date => this.normalizeDate(date))
    };
     // Attach methods and state to the global window object
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
     (window as any)[`pcfDateControl_${props.uniqueKey}`] = {  
      dateRange: this.DateRange,
      restrictedDates : this.restrictedDates
    };

    this.updateSelectedDate = this.updateSelectedDate.bind(this);
  }

  private normalizeDate(date: Date): string{
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  }
  
  private calendarDayProps: Partial<ICalendarDayProps> = {
    customDayCellRef: (element, date, classNames) => {
      if (element) {
        element.title = 'custom title from customDayCellRef: ' + date.toString();
        if (this.props.disableDays.includes(date.getDay()) || this.state.normalizedRestrictedDates.includes(this.normalizeDate(date))){
          classNames.dayOutsideBounds && element.classList.add(classNames.dayOutsideBounds);
          (element.children[0] as HTMLButtonElement).disabled = true;
        }
      }
    },
  };
  
  private DateRange = (minDate: Date, maxDate: Date) => {
    this.setState({ minDate, maxDate });
  };

  private restrictedDates = (dates: Date[]) => {
    const dts = dates.map(date => this.normalizeDate(date));
    this.setState({ normalizedRestrictedDates: dts });
  };

  private formatDate = (date?: Date): string => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
  };

  private getDatePickerStrings(): IDatePickerStrings {
    return {
      ...defaultDatePickerStrings,
      isOutOfBoundsErrorMessage: `Date must be between ${this.formatDate(this.state.minDate)} and ${this.formatDate(this.state.maxDate)}`,
    };
  }

  private updateSelectedDate(newValue: Date | null | undefined){
    this.props.onSelectDate(newValue);    
    this.setState({ currentSelectedDate: newValue ?? null });
  }

  
  public render(): React.ReactNode {
    return (
      <DatePicker
        className={styles.datePicker}
        placeholder="Select a date..."
        ariaLabel="Select a date"
        strings={this.getDatePickerStrings()}
        minDate={this.state.minDate}
        maxDate={this.state.maxDate}
        onSelectDate={this.updateSelectedDate}
        // eslint-disable-next-line react/jsx-no-duplicate-props
        value={this.state.currentSelectedDate??undefined}
        showGoToToday={true}
        highlightSelectedMonth={true}
        formatDate={this.formatDate}
        allowTextInput={this.props.allowTextInput}
        showMonthPickerAsOverlay={this.props.showMonthPickerAsOverlay}
        showWeekNumbers={this.props.showWeekNumbers}
        isRequired={this.props.isRequired}
        disabled={this.props.isDisable}
        calendarAs={(props) => <Calendar {...props} calendarDayProps={this.calendarDayProps} />}
      />
    );
  }
}


const styles = mergeStyleSets({
  datePicker: {
    minWidth: '-webkit-fill-available',
  }
});



