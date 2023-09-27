import { Component, OnInit } from '@angular/core';
import { MarketDataService } from 'src/app/services/market-data.service';

@Component({
  selector: 'app-exchanges',
  templateUrl: './exchanges.component.html',
  styleUrls: ['./exchanges.component.scss']
})
export class ExchangesComponent implements OnInit {

  constructor(private marketDataService: MarketDataService) { }

  ngOnInit(): void {
    // this.marketDataService.fetchExchanges().subscribe((data) => console.log(data))
    // this.marketDataService.fetchExchangeTickers('NASDAQ').subscribe((data) => console.log(data))
    // this.marketDataService.fetchTickerData('NASDAQ', 'AAPL').subscribe((data) => console.log(data))
  }

}
