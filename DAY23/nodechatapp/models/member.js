module.exports = function(sequelize,DataTypes){
    return sequelize.define(
        'member',
    {
        member_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            comment: '사용자고유번호',
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            comment: '이메일주소',
        },
        member_password: {
            type: DataTypes.STRING(500),
            allowNull: false,
            comment: '비밀번호',
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            comment: '이름',
        },
        profile_img_path: {
            type: DataTypes.STRING(300),
            allowNull: true,
            comment: '프로필이미지경로',
        },
        telephone: {
            type: DataTypes.STRING(20),
            allowNull: true,
            comment: '전화번호',
        },
        entry_type_code: {
            type: DataTypes.TINYINT,
            allowNull: true,
            comment: '가입유형코드 0:직접가입 1:SNS',
        },
        use_state_code: {
            type: DataTypes.TINYINT,
            allowNull: true,
            comment: '가입상태코드 0:승인대기 1:사용중 2:탈퇴처리',
        },
        birth_date: {
            type: DataTypes.STRING(6),
            allowNull: true,
            comment: '생년월일',
        },
        reg_date: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: '등록일시',
        },
        reg_member_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: '등록자고유번호',
        },
        edit_date: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: '수정일시',
        },
        edit_member_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: '수정자고유번호',
        }
    },
    {
        sequelize,
        tableName: 'member', //기본 테이블명 옵션이 복수형이 아닌 여기 지정한 테이블명으로 생성됨
        timestamps: false,
        comment: '사용자정보',
        indexes: [
            {
                name: 'PRIMARY',
                unique: true,
                using: 'BTREE',
                fields: [{ name: 'member_id' }],  //여러개의 컬럼이 프라이머리 키인 경우(복합키) {}추가하여 설정가능
            },
        ],
    });
}