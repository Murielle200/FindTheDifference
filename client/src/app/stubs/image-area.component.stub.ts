import { Component, Input } from '@angular/core';
import { ImageArea } from '@app/enums/image-area';

@Component({
    selector: 'app-image-area',
    template: '',
})
export class ImageAreaStubComponent {
    @Input() imageArea: ImageArea = ImageArea.BOTH;
}
