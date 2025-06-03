import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ReactionType } from 'src/enums/emtion-type.enum';

export class CreateEmotionRequest {
  @IsString()
  @IsNotEmpty()
  postId: string;

  @IsEnum(ReactionType)
  @IsNotEmpty()
  emotionType: ReactionType;
}
