import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blog-page',
  templateUrl: './blog-page.component.html',
  styleUrl: './blog-page.component.scss'
})
export class BlogPageComponent implements OnInit {
  blogs = [
    {
      image: 'https://static.nike.com/a/images/f_auto/dpr_3.0,cs_srgb/w_403,c_limit/337f57b2-0272-4410-93c5-82c2c0f007a2/how-to-clean-your-shoes-in-6-easy-steps.jpg',
      title: 'Phân Loại, Gắn Tag, Kiểm Tra',
      points: [
        'Bộ phận Kiểm soát Chất Lượng kiểm tra tình trạng, chất liệu giày',
        'Gắn tag định danh, chụp hình, lưu vào hệ thống của HERAMO',
        'Chọn dung dịch vệ sinh giày phù hợp'
      ]
    },
    {
      image: 'https://www.electroluxarabia.com/globalassets/elux-arabia/blogs/how-to-wash-shoes-in-the-washing-machine-a-step-by-step-guide/how-to-wash-shoes-in-washing-machine-01.jpg',
      title: 'Vệ Sinh Bên Ngoài, Bên Trong Giày',
      points: [
        'Dùng bàn chải lông siêu mềm, không làm ảnh hưởng đến chất liệu giày',
        'Dung dịch vệ sinh chuyên dụng Jason Markk, Crep Protect'
      ]
    },
    {
      image: 'https://www.candy-home.com/adapt-image/508333/Disinfettare%20scarpe.jpg?w=900&h=900&q=60&fm=jpg&version=1.0&t=1631806948788',
      title: 'Vệ Sinh Đế Giày, Dây Giày',
      points: [
        'Vệ sinh kỹ phần đế giày bằng bàn chải lông mềm',
        'Ngâm dây giày trong dung dịch vệ sinh đặc biệt & vò nhẹ nhàng'
      ]
    },
    {
      image: 'https://hgtvhome.sndimg.com/content/dam/images/hgtv/fullset/2023/5/30/02/shutterstock_2233427877.jpg.rend.hgtvcom.1280.1280.suffix/1685495316498.jpeg',
      title: 'Hấp Khử Mùi',
      points: [
        'Hong khô giày bằng máy hấp chuyên dụng',
        'Khử mùi, diệt khuẩn bằng tia UV',
        'Giày có hương thơm vô cùng dễ chịu'
      ]
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }
}
