import { Component } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  myImage = null;

  serverURL = 'https://nftagapi.yaze.live/index.php?action=UploadImage'

  constructor(
    private http: HttpClient,
  ) { }

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt
    });

    this.myImage = await fetch(image.webPath).then(r => r.blob());
    if (Capacitor.getPlatform() !== 'web') {
      this.uploadImages(this.myImage)
    }
  }

  async uploadImages(file) {
    let f = file;
    f.name = Date.now() + '.' + file.type.split('/')[1];
    const formData = new FormData();
    formData.append('picture', f, Date.now() + '.' + file.type.split('/')[1]);
    this.http.post(this.serverURL, formData).subscribe((res: any) => {
      console.log(res)
    })

  }


}
