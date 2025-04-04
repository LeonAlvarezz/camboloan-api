import { ApiResponse } from '@/shared/dto/base.dto';
import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export const ApiEnvelopResponse = <TModel extends Type<any>>(
  model: TModel | TModel[],
) => {
  const isArray = Array.isArray(model);
  const targetModel = isArray ? model[0] : model;

  return applyDecorators(
    ApiExtraModels(ApiResponse, targetModel),
    ApiOkResponse({
      schema: {
        title: `ApiResponseOf${targetModel.name}`,
        allOf: [
          { $ref: getSchemaPath(ApiResponse) },
          {
            properties: {
              data: isArray
                ? {
                    type: 'array',
                    items: { $ref: getSchemaPath(targetModel) },
                  }
                : {
                    $ref: getSchemaPath(targetModel),
                  },
            },
          },
        ],
      },
    }),
  );
};
