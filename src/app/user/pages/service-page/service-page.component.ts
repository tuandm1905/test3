import { Component } from '@angular/core';

@Component({
  selector: 'app-services-page',
  templateUrl: './service-page.component.html',
  styleUrls: ['./service-page.component.scss']
})
export class ServicePageComponent {
  services = [
    'Vệ Sinh Giày – Tối Màu',
    'Vệ Sinh Giày – Sáng Màu',
    'Vệ Sinh Giày – Da',
    'Vệ Sinh Giày – Boots/Cổ Cao',
    'Vệ Sinh Giày – Da Lộn/Da Mộc',
    'Vệ Sinh Dép/Guốc',
    'Chăm Sóc Giày – Tối Màu',
    'Chăm Sóc Giày – Sáng Màu',
    'Chăm Sóc Giày – Cao Cấp (Giặt Khô)',
    'Chăm Sóc Dép/Guốc Cao Cấp',
    'Đánh Xi Giày Da',
    'Phủ Nano Chống Nước',
    'Tẩy Ố Đế Giày',
    'Tẩy Thâm Kim Thân Giày',
    'Dán Keo Giày',
    'Repaint Đế Giày',
    'Dán Sole Bảo Vệ Đế'
  ];
}
