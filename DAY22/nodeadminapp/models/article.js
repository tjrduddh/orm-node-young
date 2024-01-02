module.exports = function (sequelize, DataTypes) {
	return sequelize.define(
		"article",
		{
			article_id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
				comment: "게시물 고유번호",
			},
			board_type_code: {
				type: DataTypes.INTEGER,
				allowNull: true,
				comment: "게시판 유형 코드",
			},
			title: {
				type: DataTypes.STRING(200),
				allowNull: false,
				comment: "제목",
			},
			article_type_code: {
				type: DataTypes.INTEGER,
				allowNull: true,
				comment: "게시물 유형 코드",
			},
			contents: {
				type: DataTypes.STRING(4000),
				allowNull: true,
				comment: "내용",
			},
			view_count: {
				type: DataTypes.INTEGER,
				allowNull: true,
				comment: "조회수",
			},
			ip_address: {
				type: DataTypes.STRING(50),
				allowNull: true,
				comment: "IP 주소",
			},
			is_display_code: {
				type: DataTypes.INTEGER,
				allowNull: true,
				comment: "표시 여부 코드",
			},
			reg_date: {
				type: DataTypes.DATE,
				allowNull: true,
				comment: "등록 일자",
			},
			reg_member_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
				comment: "등록 회원 ID",
			},
			edit_date: {
				type: DataTypes.DATE,
				allowNull: true,
				comment: "수정 일자",
			},
			edit_member_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
				comment: "수정 회원 ID",
			},
		},
		{
			sequelize,
			tableName: "article",
			timestamps: false,
			comment: "게시물 정보",
			indexes: [
				{
					name: "PRIMARY",
					unique: true,
					using: "BTREE",
					fields: [{ name: "article_id" }],
				},
			],
		}
	);
};