module.exports = function (sequelize, DataTypes) {
	return sequelize.define(
		"article_file",
		{
			article_file_id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
				comment: "게시물 파일 고유번호",
			},
			article_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				comment: "게시물 고유번호 (외래키)",
			},
			file_name: {
				type: DataTypes.STRING(100),
				allowNull: true,
				comment: "파일 이름",
			},
			file_size: {
				type: DataTypes.INTEGER,
				allowNull: true,
				comment: "파일 크기",
			},
			file_path: {
				type: DataTypes.STRING(500),
				allowNull: true,
				comment: "파일 경로",
			},
			file_type: {
				type: DataTypes.STRING(50),
				allowNull: true,
				comment: "파일 유형",
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
		},
		{
			sequelize,
			tableName: "article_file",
			timestamps: false,
			comment: "게시물 파일 정보",
			indexes: [
				{
					name: "PRIMARY",
					unique: true,
					using: "BTREE",
					fields: [{ name: "article_file_id" }],
				},
				{
					name: "FK_article_id",
					using: "BTREE",
					fields: [{ name: "article_id" }],
				},
			],
		}
	);
};