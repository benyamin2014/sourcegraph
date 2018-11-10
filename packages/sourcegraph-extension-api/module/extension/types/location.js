import { Position } from './position';
import { Range } from './range';
import { URI } from './uri';
export class Location {
    static isLocation(thing) {
        if (thing instanceof Location) {
            return true;
        }
        if (!thing) {
            return false;
        }
        return Range.isRange(thing.range) && URI.isURI(thing.uri);
    }
    constructor(uri, rangeOrPosition) {
        this.uri = uri;
        if (!rangeOrPosition) {
            // that's OK
        }
        else if (rangeOrPosition instanceof Range) {
            this.range = rangeOrPosition;
        }
        else if (rangeOrPosition instanceof Position) {
            this.range = new Range(rangeOrPosition, rangeOrPosition);
        }
        else {
            throw new Error('Illegal argument');
        }
    }
    toJSON() {
        return {
            uri: this.uri,
            range: this.range,
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYXRpb24uanMiLCJzb3VyY2VSb290Ijoic3JjLyIsInNvdXJjZXMiOlsiZXh0ZW5zaW9uL3R5cGVzL2xvY2F0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxZQUFZLENBQUE7QUFDckMsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLFNBQVMsQ0FBQTtBQUMvQixPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sT0FBTyxDQUFBO0FBRTNCLE1BQU0sT0FBTyxRQUFRO0lBQ1YsTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFVO1FBQy9CLElBQUksS0FBSyxZQUFZLFFBQVEsRUFBRTtZQUMzQixPQUFPLElBQUksQ0FBQTtTQUNkO1FBQ0QsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNSLE9BQU8sS0FBSyxDQUFBO1NBQ2Y7UUFDRCxPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUUsS0FBa0IsQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFFLEtBQWtCLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDekYsQ0FBQztJQUtELFlBQVksR0FBb0IsRUFBRSxlQUEwRDtRQUN4RixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQTtRQUVkLElBQUksQ0FBQyxlQUFlLEVBQUU7WUFDbEIsWUFBWTtTQUNmO2FBQU0sSUFBSSxlQUFlLFlBQVksS0FBSyxFQUFFO1lBQ3pDLElBQUksQ0FBQyxLQUFLLEdBQUcsZUFBZSxDQUFBO1NBQy9CO2FBQU0sSUFBSSxlQUFlLFlBQVksUUFBUSxFQUFFO1lBQzVDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsZUFBZSxFQUFFLGVBQWUsQ0FBQyxDQUFBO1NBQzNEO2FBQU07WUFDSCxNQUFNLElBQUksS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUE7U0FDdEM7SUFDTCxDQUFDO0lBRU0sTUFBTTtRQUNULE9BQU87WUFDSCxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUc7WUFDYixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7U0FDcEIsQ0FBQTtJQUNMLENBQUM7Q0FDSiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHNvdXJjZWdyYXBoIGZyb20gJ3NvdXJjZWdyYXBoJ1xuaW1wb3J0IHsgUG9zaXRpb24gfSBmcm9tICcuL3Bvc2l0aW9uJ1xuaW1wb3J0IHsgUmFuZ2UgfSBmcm9tICcuL3JhbmdlJ1xuaW1wb3J0IHsgVVJJIH0gZnJvbSAnLi91cmknXG5cbmV4cG9ydCBjbGFzcyBMb2NhdGlvbiBpbXBsZW1lbnRzIHNvdXJjZWdyYXBoLkxvY2F0aW9uIHtcbiAgICBwdWJsaWMgc3RhdGljIGlzTG9jYXRpb24odGhpbmc6IGFueSk6IHRoaW5nIGlzIHNvdXJjZWdyYXBoLkxvY2F0aW9uIHtcbiAgICAgICAgaWYgKHRoaW5nIGluc3RhbmNlb2YgTG9jYXRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGluZykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFJhbmdlLmlzUmFuZ2UoKHRoaW5nIGFzIExvY2F0aW9uKS5yYW5nZSkgJiYgVVJJLmlzVVJJKCh0aGluZyBhcyBMb2NhdGlvbikudXJpKVxuICAgIH1cblxuICAgIHB1YmxpYyB1cmk6IHNvdXJjZWdyYXBoLlVSSVxuICAgIHB1YmxpYyByYW5nZT86IHNvdXJjZWdyYXBoLlJhbmdlXG5cbiAgICBjb25zdHJ1Y3Rvcih1cmk6IHNvdXJjZWdyYXBoLlVSSSwgcmFuZ2VPclBvc2l0aW9uPzogc291cmNlZ3JhcGguUmFuZ2UgfCBzb3VyY2VncmFwaC5Qb3NpdGlvbikge1xuICAgICAgICB0aGlzLnVyaSA9IHVyaVxuXG4gICAgICAgIGlmICghcmFuZ2VPclBvc2l0aW9uKSB7XG4gICAgICAgICAgICAvLyB0aGF0J3MgT0tcbiAgICAgICAgfSBlbHNlIGlmIChyYW5nZU9yUG9zaXRpb24gaW5zdGFuY2VvZiBSYW5nZSkge1xuICAgICAgICAgICAgdGhpcy5yYW5nZSA9IHJhbmdlT3JQb3NpdGlvblxuICAgICAgICB9IGVsc2UgaWYgKHJhbmdlT3JQb3NpdGlvbiBpbnN0YW5jZW9mIFBvc2l0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLnJhbmdlID0gbmV3IFJhbmdlKHJhbmdlT3JQb3NpdGlvbiwgcmFuZ2VPclBvc2l0aW9uKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbGxlZ2FsIGFyZ3VtZW50JylcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyB0b0pTT04oKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHVyaTogdGhpcy51cmksXG4gICAgICAgICAgICByYW5nZTogdGhpcy5yYW5nZSxcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==