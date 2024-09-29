import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('Date')
export class DateScalar implements CustomScalar<string, string> {
  // 클라이언트에서 받은 값을 파싱 (입력 시)
  parseValue(value: string): string {
    // 여기서는 문자열 그대로 반환
    return value;
  }

  // 서버에서 클라이언트로 반환할 때 (출력 시)
  serialize(value: string): string {
    // 날짜 값을 그대로 반환
    return value;
  }

  // GraphQL AST에서 값을 파싱할 때
  parseLiteral(ast: ValueNode): string {
    if (ast.kind === Kind.STRING) {
      // 문자열로 받아 그대로 반환
      return ast.value;
    }
    return null;
  }
}
